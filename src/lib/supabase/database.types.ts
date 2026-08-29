export type ProfileRole = "idea_poster" | "investor" | "mentor" | "admin";
export type VisibilityLevel = "public" | "connections" | "private";
export type IdeaStage =
  | "idea"
  | "prototype"
  | "mvp"
  | "early_traction"
  | "growth";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string;
          full_name: string | null;
          username: string | null;
          avatar_url: string | null;
          headline: string | null;
          bio: string | null;
          location: string | null;
          website_url: string | null;
          visibility: VisibilityLevel;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          location?: string | null;
          website_url?: string | null;
          visibility?: VisibilityLevel;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string;
          full_name?: string | null;
          username?: string | null;
          avatar_url?: string | null;
          headline?: string | null;
          bio?: string | null;
          location?: string | null;
          website_url?: string | null;
          visibility?: VisibilityLevel;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      profile_roles: {
        Row: {
          profile_id: string;
          role: ProfileRole;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          role: ProfileRole;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          is_primary?: boolean;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          profile_id: string;
          interests: string[];
          sectors: string[];
          goals: string[];
          preferred_stages: IdeaStage[];
          investment_range: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          interests?: string[];
          sectors?: string[];
          goals?: string[];
          preferred_stages?: IdeaStage[];
          investment_range?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          interests?: string[];
          sectors?: string[];
          goals?: string[];
          preferred_stages?: IdeaStage[];
          investment_range?: string | null;
          metadata?: Record<string, unknown>;
          updated_at?: string;
        };
        Relationships: [];
      };
      investor_profiles: {
        Row: {
          profile_id: string;
          investor_type: string | null;
          bio: string | null;
          sectors: string[];
          preferred_stages: IdeaStage[];
          location_preference: string | null;
          years_experience: number | null;
          portfolio_visibility: VisibilityLevel;
          investment_history_visibility: VisibilityLevel;
          public_investment_count: number;
          active_interest_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          investor_type?: string | null;
          bio?: string | null;
          sectors?: string[];
          preferred_stages?: IdeaStage[];
          location_preference?: string | null;
          years_experience?: number | null;
          portfolio_visibility?: VisibilityLevel;
          investment_history_visibility?: VisibilityLevel;
          public_investment_count?: number;
          active_interest_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          investor_type?: string | null;
          bio?: string | null;
          sectors?: string[];
          preferred_stages?: IdeaStage[];
          location_preference?: string | null;
          years_experience?: number | null;
          portfolio_visibility?: VisibilityLevel;
          investment_history_visibility?: VisibilityLevel;
          updated_at?: string;
        };
        Relationships: [];
      };
      mentor_profiles: {
        Row: {
          profile_id: string;
          expertise: string[];
          bio: string | null;
          availability: string | null;
          visibility: VisibilityLevel;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          expertise?: string[];
          bio?: string | null;
          availability?: string | null;
          visibility?: VisibilityLevel;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          expertise?: string[];
          bio?: string | null;
          availability?: string | null;
          visibility?: VisibilityLevel;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      profile_role: ProfileRole;
      visibility_level: VisibilityLevel;
      idea_stage: IdeaStage;
    };
    CompositeTypes: Record<string, never>;
  };
};
