-- ============================================================
-- 1. 核心状态表 (Profiles)
-- 仅保留系统级状态，严禁用户自行 Update
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  is_beta_user BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. 用户详情表 (Profile Details)
-- 拥有独立 ID，存放展示信息，允许用户更新自己的记录
-- ============================================================
CREATE TABLE public.profile_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,

  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  occupation TEXT,
  additional_info JSONB,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. 统计数据表 (Profile Stats)
-- 独立解耦高频更新的 XP，避免锁表和缓存问题
-- ============================================================
CREATE TABLE public.profile_stats (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. 统一更新时间 Trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER profile_details_updated_at
  BEFORE UPDATE ON public.profile_details
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER profile_stats_updated_at
  BEFORE UPDATE ON public.profile_stats
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ============================================================
-- 5. OAuth 自动注册与智能用户名碰撞处理
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  is_unique BOOLEAN := false;
BEGIN
  -- 1. 提取基础用户名：优先用 GitHub 传来的用户名，其次用邮箱前缀，都没有就叫 user
  base_username := coalesce(
    NEW.raw_user_meta_data->>'preferred_username',
    split_part(NEW.email, '@', 1),
    'user'
  );

  -- 清理非法字符（转小写，且只保留字母和数字）
  base_username := lower(regexp_replace(base_username, '[^a-z0-9]', '', 'g'));
  final_username := base_username;

  -- 2. 核心：用户名碰撞检测算法
  WHILE NOT is_unique LOOP
    -- 去 profile_details 表里查这个名字存在不存在
    IF EXISTS (SELECT 1 FROM public.profile_details WHERE username = final_username) THEN
      -- 如果存在（发生冲突），就在基础名字后追加 4 位随机数字 (1000 - 9999)
      final_username := base_username || floor(random() * 9000 + 1000)::text;
    ELSE
      -- 如果不存在，标记为唯一，跳出循环
      is_unique := true;
    END IF;
  END LOOP;

  -- 3. 依次插入三张领域业务表
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profile_details (profile_id, email, name, avatar_url, username)
  VALUES (
    NEW.id,
    NEW.email,
    coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    coalesce(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    final_username -- 传入生成好的唯一用户名
  )
  ON CONFLICT (profile_id) DO NOTHING;

  INSERT INTO public.profile_stats (profile_id, total_xp, lessons_completed)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (profile_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- 6. RLS (Row Level Security) 严格读写分离隔离
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_stats ENABLE ROW LEVEL SECURITY;

-- 【读权限】所有人均可读取这三张表
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Details viewable by everyone" ON public.profile_details FOR SELECT USING (true);
CREATE POLICY "Stats viewable by everyone" ON public.profile_stats FOR SELECT USING (true);

-- 【写权限】用户只能 Update 自己的 profile_details
-- 严禁用户直接通过客户端 Update profiles（保护系统状态）和 profile_stats（保护经验值）
CREATE POLICY "Users can update own details" ON public.profile_details
  FOR UPDATE USING (profile_id = (select auth.uid()));
