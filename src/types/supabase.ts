export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			activity_logs: {
				Row: {
					created_at: string;
					id: string;
					lesson_id: string;
					profile_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					lesson_id: string;
					profile_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					lesson_id?: string;
					profile_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "activity_logs_lesson_id_fkey";
						columns: ["lesson_id"];
						isOneToOne: false;
						referencedRelation: "lessons";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "activity_logs_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			courses: {
				Row: {
					average_rating: number;
					created_at: string;
					description: string | null;
					difficulty: Database["public"]["Enums"]["course_difficulty"];
					duration_in_hours: number;
					id: string;
					long_description: string | null;
					name: string;
					order_index: number;
					review_count: number;
					slug: string;
					status: Database["public"]["Enums"]["course_status"];
					thumbnail_url: string | null;
					updated_at: string;
					xp_reward: number;
				};
				Insert: {
					average_rating?: number;
					created_at?: string;
					description?: string | null;
					difficulty?: Database["public"]["Enums"]["course_difficulty"];
					duration_in_hours?: number;
					id?: string;
					long_description?: string | null;
					name: string;
					order_index?: number;
					review_count?: number;
					slug: string;
					status?: Database["public"]["Enums"]["course_status"];
					thumbnail_url?: string | null;
					updated_at?: string;
					xp_reward?: number;
				};
				Update: {
					average_rating?: number;
					created_at?: string;
					description?: string | null;
					difficulty?: Database["public"]["Enums"]["course_difficulty"];
					duration_in_hours?: number;
					id?: string;
					long_description?: string | null;
					name?: string;
					order_index?: number;
					review_count?: number;
					slug?: string;
					status?: Database["public"]["Enums"]["course_status"];
					thumbnail_url?: string | null;
					updated_at?: string;
					xp_reward?: number;
				};
				Relationships: [];
			};
			lesson_submissions: {
				Row: {
					completed_at: string | null;
					created_at: string;
					id: string;
					is_passed: boolean;
					is_ready_for_completion: boolean;
					lesson_id: string;
					profile_id: string;
					updated_at: string;
				};
				Insert: {
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					is_passed?: boolean;
					is_ready_for_completion?: boolean;
					lesson_id: string;
					profile_id: string;
					updated_at?: string;
				};
				Update: {
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					is_passed?: boolean;
					is_ready_for_completion?: boolean;
					lesson_id?: string;
					profile_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "lesson_submissions_lesson_id_fkey";
						columns: ["lesson_id"];
						isOneToOne: false;
						referencedRelation: "lessons";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "lesson_submissions_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			lessons: {
				Row: {
					code_editor: Json;
					context: string | null;
					course_id: string;
					created_at: string;
					description: string | null;
					id: string;
					is_free: boolean;
					module_id: string;
					name: string;
					objectives: Json;
					order_index: number;
					resources: Json;
					slug: string;
					tasks: Json;
					type: Database["public"]["Enums"]["lesson_type"];
					updated_at: string;
					video_id: string | null;
					whiteboard: Json;
					xp_reward: number;
				};
				Insert: {
					code_editor?: Json;
					context?: string | null;
					course_id: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					is_free?: boolean;
					module_id: string;
					name: string;
					objectives?: Json;
					order_index?: number;
					resources?: Json;
					slug: string;
					tasks?: Json;
					type?: Database["public"]["Enums"]["lesson_type"];
					updated_at?: string;
					video_id?: string | null;
					whiteboard?: Json;
					xp_reward?: number;
				};
				Update: {
					code_editor?: Json;
					context?: string | null;
					course_id?: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					is_free?: boolean;
					module_id?: string;
					name?: string;
					objectives?: Json;
					order_index?: number;
					resources?: Json;
					slug?: string;
					tasks?: Json;
					type?: Database["public"]["Enums"]["lesson_type"];
					updated_at?: string;
					video_id?: string | null;
					whiteboard?: Json;
					xp_reward?: number;
				};
				Relationships: [
					{
						foreignKeyName: "lessons_module_id_course_id_fkey";
						columns: ["module_id", "course_id"];
						isOneToOne: false;
						referencedRelation: "modules";
						referencedColumns: ["id", "course_id"];
					},
				];
			};
			modules: {
				Row: {
					course_id: string;
					created_at: string;
					description: string | null;
					id: string;
					name: string;
					order_index: number;
					slug: string;
					updated_at: string;
				};
				Insert: {
					course_id: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					name: string;
					order_index?: number;
					slug: string;
					updated_at?: string;
				};
				Update: {
					course_id?: string;
					created_at?: string;
					description?: string | null;
					id?: string;
					name?: string;
					order_index?: number;
					slug?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "modules_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "course_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "modules_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "course_summaries";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "modules_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "courses";
						referencedColumns: ["id"];
					},
				];
			};
			profile_details: {
				Row: {
					additional_info: Json | null;
					avatar_url: string | null;
					bio: string | null;
					created_at: string;
					email: string | null;
					id: string;
					name: string | null;
					occupation: string | null;
					profile_id: string;
					updated_at: string;
					username: string;
				};
				Insert: {
					additional_info?: Json | null;
					avatar_url?: string | null;
					bio?: string | null;
					created_at?: string;
					email?: string | null;
					id?: string;
					name?: string | null;
					occupation?: string | null;
					profile_id: string;
					updated_at?: string;
					username: string;
				};
				Update: {
					additional_info?: Json | null;
					avatar_url?: string | null;
					bio?: string | null;
					created_at?: string;
					email?: string | null;
					id?: string;
					name?: string | null;
					occupation?: string | null;
					profile_id?: string;
					updated_at?: string;
					username?: string;
				};
				Relationships: [
					{
						foreignKeyName: "profile_details_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: true;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			profile_stats: {
				Row: {
					lessons_completed: number;
					profile_id: string;
					total_xp: number;
					updated_at: string;
				};
				Insert: {
					lessons_completed?: number;
					profile_id: string;
					total_xp?: number;
					updated_at?: string;
				};
				Update: {
					lessons_completed?: number;
					profile_id?: string;
					total_xp?: number;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "profile_stats_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: true;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			profiles: {
				Row: {
					created_at: string;
					id: string;
					is_anonymous: boolean;
					is_beta_user: boolean;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					id: string;
					is_anonymous?: boolean;
					is_beta_user?: boolean;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					is_anonymous?: boolean;
					is_beta_user?: boolean;
					updated_at?: string;
				};
				Relationships: [];
			};
			user_code_editors: {
				Row: {
					created_at: string;
					files: Json;
					id: string;
					lesson_id: string;
					profile_id: string;
					template: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					files?: Json;
					id?: string;
					lesson_id: string;
					profile_id: string;
					template?: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					files?: Json;
					id?: string;
					lesson_id?: string;
					profile_id?: string;
					template?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_code_editors_lesson_id_fkey";
						columns: ["lesson_id"];
						isOneToOne: false;
						referencedRelation: "lessons";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_code_editors_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			xp_records: {
				Row: {
					course_id: string | null;
					created_at: string;
					id: string;
					lesson_id: string | null;
					profile_id: string;
					source_type: Database["public"]["Enums"]["xp_source_type"];
					xp_rewarded: number;
				};
				Insert: {
					course_id?: string | null;
					created_at?: string;
					id?: string;
					lesson_id?: string | null;
					profile_id: string;
					source_type: Database["public"]["Enums"]["xp_source_type"];
					xp_rewarded: number;
				};
				Update: {
					course_id?: string | null;
					created_at?: string;
					id?: string;
					lesson_id?: string | null;
					profile_id?: string;
					source_type?: Database["public"]["Enums"]["xp_source_type"];
					xp_rewarded?: number;
				};
				Relationships: [
					{
						foreignKeyName: "xp_records_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "course_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "xp_records_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "course_summaries";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "xp_records_course_id_fkey";
						columns: ["course_id"];
						isOneToOne: false;
						referencedRelation: "courses";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "xp_records_lesson_id_fkey";
						columns: ["lesson_id"];
						isOneToOne: false;
						referencedRelation: "lessons";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "xp_records_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			course_details: {
				Row: {
					average_rating: number | null;
					created_at: string | null;
					description: string | null;
					difficulty: Database["public"]["Enums"]["course_difficulty"] | null;
					duration_in_hours: number | null;
					id: string | null;
					lesson_count: number | null;
					long_description: string | null;
					module_count: number | null;
					modules: Json | null;
					name: string | null;
					order_index: number | null;
					review_count: number | null;
					slug: string | null;
					status: Database["public"]["Enums"]["course_status"] | null;
					task_count: number | null;
					thumbnail_url: string | null;
					updated_at: string | null;
					xp_reward: number | null;
				};
				Insert: {
					average_rating?: number | null;
					created_at?: string | null;
					description?: string | null;
					difficulty?: Database["public"]["Enums"]["course_difficulty"] | null;
					duration_in_hours?: number | null;
					id?: string | null;
					lesson_count?: never;
					long_description?: string | null;
					module_count?: never;
					modules?: never;
					name?: string | null;
					order_index?: number | null;
					review_count?: number | null;
					slug?: string | null;
					status?: Database["public"]["Enums"]["course_status"] | null;
					task_count?: never;
					thumbnail_url?: string | null;
					updated_at?: string | null;
					xp_reward?: number | null;
				};
				Update: {
					average_rating?: number | null;
					created_at?: string | null;
					description?: string | null;
					difficulty?: Database["public"]["Enums"]["course_difficulty"] | null;
					duration_in_hours?: number | null;
					id?: string | null;
					lesson_count?: never;
					long_description?: string | null;
					module_count?: never;
					modules?: never;
					name?: string | null;
					order_index?: number | null;
					review_count?: number | null;
					slug?: string | null;
					status?: Database["public"]["Enums"]["course_status"] | null;
					task_count?: never;
					thumbnail_url?: string | null;
					updated_at?: string | null;
					xp_reward?: number | null;
				};
				Relationships: [];
			};
			course_summaries: {
				Row: {
					average_rating: number | null;
					description: string | null;
					difficulty: Database["public"]["Enums"]["course_difficulty"] | null;
					duration_in_hours: number | null;
					id: string | null;
					lesson_count: number | null;
					module_count: number | null;
					name: string | null;
					order_index: number | null;
					review_count: number | null;
					slug: string | null;
					status: Database["public"]["Enums"]["course_status"] | null;
					task_count: number | null;
					thumbnail_url: string | null;
				};
				Relationships: [];
			};
			profile_activity_data_view: {
				Row: {
					count: number | null;
					date: string | null;
					profile_id: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "activity_logs_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			profile_course_progress_view: {
				Row: {
					completed_lessons: number | null;
					course_template_id: string | null;
					course_template_slug: string | null;
					course_template_name: string | null;
					profile_id: string | null;
					progress_percentage: number | null;
					total_lessons: number | null;
				};
				Relationships: [
					{
						foreignKeyName: "lesson_submissions_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			profile_recent_activity_view: {
				Row: {
					completed_at: string | null;
					course_template: Json | null;
					id: string | null;
					lesson_template: Json | null;
					profile_id: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "activity_logs_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Functions: {
			calc_task_count: {
				Args: {
					l_tasks: Json;
					l_type: Database["public"]["Enums"]["lesson_type"];
				};
				Returns: number;
			};
			complete_lesson: {
				Args: { p_lesson_id: string; p_profile_id?: string };
				Returns: undefined;
			};
			reset_lesson: {
				Args: { p_lesson_id: string; p_profile_id?: string };
				Returns: undefined;
			};
			sync_profile_stats: {
				Args: { p_profile_id: string };
				Returns: undefined;
			};
		};
		Enums: {
			course_difficulty: "beginner" | "intermediate" | "advanced";
			course_status: "draft" | "published" | "archived";
			lesson_type: "standard" | "whiteboard" | "video" | "quiz";
			xp_source_type: "lesson" | "course";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {
			course_difficulty: ["beginner", "intermediate", "advanced"],
			course_status: ["draft", "published", "archived"],
			lesson_type: ["standard", "whiteboard", "video", "quiz"],
			xp_source_type: ["lesson", "course"],
		},
	},
} as const;
