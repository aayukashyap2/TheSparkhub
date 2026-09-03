export type ProfileRole = "idea_poster" | "investor" | "mentor" | "admin";
export type VisibilityLevel = "public" | "connections" | "private";
export type IdeaVisibility = "public" | "unlisted" | "private";
export type IdeaStage =
  | "idea"
  | "prototype"
  | "mvp"
  | "early_traction"
  | "growth";
export type IdeaStatus = "draft" | "published" | "archived";
export type MemberRole = "owner" | "collaborator" | "mentor";
export type InterestLevel = "low" | "medium" | "high";
export type InvestmentInterestStatus =
  | "interested"
  | "contacted"
  | "discussion"
  | "passed"
  | "converted";

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
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      ideas: {
        Row: {
          id: string;
          creator_id: string;
          category_id: string | null;
          title: string;
          slug: string;
          summary: string;
          problem: string | null;
          solution: string | null;
          target_users: string | null;
          technology: string | null;
          market_impact: string | null;
          stage: IdeaStage;
          status: IdeaStatus;
          visibility: IdeaVisibility;
          seeking_funding: boolean;
          funding_goal: number | null;
          funding_currency: string;
          funding_visibility: VisibilityLevel;
          use_of_funds: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          category_id?: string | null;
          title: string;
          slug: string;
          summary: string;
          problem?: string | null;
          solution?: string | null;
          target_users?: string | null;
          technology?: string | null;
          market_impact?: string | null;
          stage?: IdeaStage;
          status?: IdeaStatus;
          visibility?: IdeaVisibility;
          seeking_funding?: boolean;
          funding_goal?: number | null;
          funding_currency?: string;
          funding_visibility?: VisibilityLevel;
          use_of_funds?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          title?: string;
          slug?: string;
          summary?: string;
          problem?: string | null;
          solution?: string | null;
          target_users?: string | null;
          technology?: string | null;
          market_impact?: string | null;
          stage?: IdeaStage;
          status?: IdeaStatus;
          visibility?: IdeaVisibility;
          seeking_funding?: boolean;
          funding_goal?: number | null;
          funding_currency?: string;
          funding_visibility?: VisibilityLevel;
          use_of_funds?: string | null;
          published_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      idea_tags: {
        Row: {
          idea_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          idea_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      idea_members: {
        Row: {
          idea_id: string;
          profile_id: string;
          role: MemberRole;
          created_at: string;
        };
        Insert: {
          idea_id: string;
          profile_id: string;
          role?: MemberRole;
          created_at?: string;
        };
        Update: {
          role?: MemberRole;
        };
        Relationships: [];
      };
      idea_likes: {
        Row: {
          idea_id: string;
          profile_id: string;
          created_at: string;
        };
        Insert: {
          idea_id: string;
          profile_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      idea_saves: {
        Row: {
          idea_id: string;
          profile_id: string;
          created_at: string;
        };
        Insert: {
          idea_id: string;
          profile_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      idea_followers: {
        Row: {
          idea_id: string;
          profile_id: string;
          created_at: string;
        };
        Insert: {
          idea_id: string;
          profile_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      idea_shares: {
        Row: {
          id: string;
          idea_id: string;
          profile_id: string | null;
          channel: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          idea_id: string;
          profile_id?: string | null;
          channel?: string | null;
          created_at?: string;
        };
        Update: {
          channel?: string | null;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          idea_id: string;
          author_id: string;
          parent_id: string | null;
          body: string;
          is_hidden: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          idea_id: string;
          author_id: string;
          parent_id?: string | null;
          body: string;
          is_hidden?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          body?: string;
          is_hidden?: boolean;
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
      investment_interests: {
        Row: {
          id: string;
          idea_id: string;
          investor_id: string;
          creator_id: string;
          level: InterestLevel;
          preferred_stage: IdeaStage | null;
          message: string | null;
          proposed_range: string | null;
          questions: string | null;
          status: InvestmentInterestStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          idea_id: string;
          investor_id: string;
          creator_id?: string;
          level?: InterestLevel;
          preferred_stage?: IdeaStage | null;
          message?: string | null;
          proposed_range?: string | null;
          questions?: string | null;
          status?: InvestmentInterestStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          level?: InterestLevel;
          preferred_stage?: IdeaStage | null;
          message?: string | null;
          proposed_range?: string | null;
          questions?: string | null;
          status?: InvestmentInterestStatus;
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
      idea_visibility: IdeaVisibility;
      idea_stage: IdeaStage;
      idea_status: IdeaStatus;
      member_role: MemberRole;
      interest_level: InterestLevel;
      investment_interest_status: InvestmentInterestStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
