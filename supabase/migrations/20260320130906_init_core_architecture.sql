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
-- ============================================================
CREATE TABLE public.profile_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- 显式命名所有约束，彻底告别匿名随机名
  username TEXT NOT NULL
    CONSTRAINT profile_details_username_key UNIQUE
    CONSTRAINT profile_details_username_check CHECK (username ~ '^[a-z0-9]{3,30}$'),

  email TEXT CONSTRAINT profile_details_email_key UNIQUE,

  -- 增加长度上限，防止超长文本滥用
  name TEXT CONSTRAINT profile_details_name_length_check CHECK (char_length(name) <= 50),
  avatar_url TEXT CONSTRAINT profile_details_avatar_url_length_check CHECK (char_length(avatar_url) <= 1000),
  bio TEXT CONSTRAINT profile_details_bio_length_check CHECK (char_length(bio) <= 500),
  occupation TEXT CONSTRAINT profile_details_occupation_length_check CHECK (char_length(occupation) <= 100),

  -- 限制 JSONB 的大小（通过转换为文本计算字节数，这里限制约为 5KB）
  additional_info JSONB CONSTRAINT profile_details_additional_info_size_check CHECK (octet_length(additional_info::text) <= 5120),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. 统计数据表 (Profile Stats)
-- ============================================================
CREATE TABLE public.profile_stats (
  profile_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- 显式命名非负约束，保持风格统一，方便排查
  total_xp INTEGER NOT NULL DEFAULT 0
    CONSTRAINT profile_stats_total_xp_check CHECK (total_xp >= 0),

  lessons_completed INTEGER NOT NULL DEFAULT 0
    CONSTRAINT profile_stats_lessons_completed_check CHECK (lessons_completed >= 0),

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
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER profile_details_updated_at
  BEFORE UPDATE ON public.profile_details
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER profile_stats_updated_at
  BEFORE UPDATE ON public.profile_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 5. OAuth 自动注册与智能用户名碰撞处理
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  _email TEXT;
  _constraint_name TEXT;
  max_attempts INT := 10;
  attempt INT := 0;
BEGIN
  _email := NEW.email;

  -- 提取基础用户名并清理
  base_username := coalesce(
    NEW.raw_user_meta_data->>'preferred_username',
    split_part(NEW.email, '@', 1),
    'user'
  );

  base_username := lower(regexp_replace(base_username, '[^a-z0-9]', '', 'g'));
  base_username := substring(base_username, 1, 20);

  IF length(base_username) < 3 THEN
    base_username := 'user' || floor(random() * 900 + 100)::text;
  END IF;

  final_username := base_username;

  -- 插入核心表
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;

  -- 循环尝试插入，精准捕获约束异常
  LOOP
    attempt := attempt + 1;
    IF attempt > max_attempts THEN
      RAISE EXCEPTION '无法为用户生成唯一记录 (重试 % 次)', max_attempts;
    END IF;

    BEGIN
      INSERT INTO public.profile_details (profile_id, email, name, avatar_url, username)
      VALUES (
        NEW.id,
        _email,
        coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        coalesce(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
        final_username
      );
      EXIT;
    EXCEPTION WHEN unique_violation THEN
      GET STACKED DIAGNOSTICS _constraint_name = CONSTRAINT_NAME;

      IF _constraint_name = 'profile_details_email_key' THEN
        _email := NULL;
      ELSIF _constraint_name = 'profile_details_username_key' THEN
        final_username := base_username || floor(random() * 9000 + 1000)::text;
      ELSE
        RAISE;
      END IF;
    END;
  END LOOP;

  -- 插入统计表
  INSERT INTO public.profile_stats (profile_id, total_xp, lessons_completed)
  VALUES (NEW.id, 0, 0) ON CONFLICT (profile_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. Auth 邮箱变更同步 Trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_user_updated()
RETURNS TRIGGER LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.profile_details
  SET email = NEW.email
  WHERE profile_id = NEW.id;
  RETURN NEW;
EXCEPTION WHEN unique_violation THEN
  RAISE WARNING 'Email sync failed for user % due to unique constraint', NEW.id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_updated();

-- ============================================================
-- 7. RLS (Row Level Security) 及 列级防护
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Details viewable by everyone" ON public.profile_details FOR SELECT USING (true);
CREATE POLICY "Stats viewable by everyone" ON public.profile_stats FOR SELECT USING (true);

CREATE POLICY "Users can update own details"
  ON public.profile_details
  FOR UPDATE
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- 撤销登录用户对系统接管字段的修改权限
REVOKE UPDATE (id, profile_id, email, created_at)
ON public.profile_details FROM authenticated
