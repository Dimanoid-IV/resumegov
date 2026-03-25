export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          stripe_customer_id: string | null;
          plan_type: 'free' | 'basic' | 'pro' | 'enterprise';
          credits_remaining: number;
          is_admin: boolean;
          free_analysis_count: number;
          last_free_analysis_at: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          stripe_customer_id?: string | null;
          plan_type?: 'free' | 'basic' | 'pro' | 'enterprise';
          credits_remaining?: number;
          is_admin?: boolean;
          free_analysis_count?: number;
          last_free_analysis_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          stripe_customer_id?: string | null;
          plan_type?: 'free' | 'basic' | 'pro' | 'enterprise';
          credits_remaining?: number;
          is_admin?: boolean;
          free_analysis_count?: number;
          last_free_analysis_at?: string | null;
          created_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          original_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_text?: string;
          created_at?: string;
        };
      };
      job_posts: {
        Row: {
          id: string;
          user_id: string;
          original_text: string;
          parsed_json: Json;
          gs_level: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_text: string;
          parsed_json?: Json;
          gs_level?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_text?: string;
          parsed_json?: Json;
          gs_level?: string | null;
          created_at?: string;
        };
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          resume_id: string;
          job_post_id: string;
          compatibility_score: number | null;
          keyword_score: number | null;
          specialized_score: number | null;
          compliance_score: number | null;
          achievement_score: number | null;
          word_count: number | null;
          word_count_original: number | null;
          word_count_final: number | null;
          coverage_original: number | null;
          coverage_final: number | null;
          risk_level: string | null;
          feedback_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_id: string;
          job_post_id: string;
          compatibility_score?: number | null;
          keyword_score?: number | null;
          specialized_score?: number | null;
          compliance_score?: number | null;
          achievement_score?: number | null;
          word_count?: number | null;
          word_count_original?: number | null;
          word_count_final?: number | null;
          coverage_original?: number | null;
          coverage_final?: number | null;
          risk_level?: string | null;
          feedback_json?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_id?: string;
          job_post_id?: string;
          compatibility_score?: number | null;
          keyword_score?: number | null;
          specialized_score?: number | null;
          compliance_score?: number | null;
          achievement_score?: number | null;
          word_count?: number | null;
          word_count_original?: number | null;
          word_count_final?: number | null;
          coverage_original?: number | null;
          coverage_final?: number | null;
          risk_level?: string | null;
          feedback_json?: Json;
          created_at?: string;
        };
      };
      optimizations: {
        Row: {
          id: string;
          analysis_id: string;
          compressed_resume_text: string;
          qualification_coverage_percent: number | null;
          final_word_count: number;
          ksa_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          analysis_id: string;
          compressed_resume_text: string;
          qualification_coverage_percent?: number | null;
          final_word_count: number;
          ksa_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          analysis_id?: string;
          compressed_resume_text?: string;
          qualification_coverage_percent?: number | null;
          final_word_count?: number;
          ksa_text?: string | null;
          created_at?: string;
        };
      };
      ai_usage_logs: {
        Row: {
          id: string;
          user_id: string;
          model: string;
          tokens_used: number | null;
          latency_ms: number | null;
          success: boolean;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          model: string;
          tokens_used?: number | null;
          latency_ms?: number | null;
          success: boolean;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          model?: string;
          tokens_used?: number | null;
          latency_ms?: number | null;
          success?: boolean;
          error_message?: string | null;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          stripe_payment_id: string;
          amount: number;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_payment_id: string;
          amount: number;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_payment_id?: string;
          amount?: number;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          created_at?: string;
        };
      };
      hallucination_flags: {
        Row: {
          id: string;
          optimization_id: string | null;
          analysis_id: string | null;
          flagged_by: string;
          flag_type: 'hallucinated_job' | 'fabricated_metric' | 'wrong_gs_level' | 'wrong_qualification' | 'inaccurate_score' | 'other';
          notes: string | null;
          resolved: boolean;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          optimization_id?: string | null;
          analysis_id?: string | null;
          flagged_by: string;
          flag_type: 'hallucinated_job' | 'fabricated_metric' | 'wrong_gs_level' | 'wrong_qualification' | 'inaccurate_score' | 'other';
          notes?: string | null;
          resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          optimization_id?: string | null;
          analysis_id?: string | null;
          flagged_by?: string;
          flag_type?: 'hallucinated_job' | 'fabricated_metric' | 'wrong_gs_level' | 'wrong_qualification' | 'inaccurate_score' | 'other';
          notes?: string | null;
          resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
