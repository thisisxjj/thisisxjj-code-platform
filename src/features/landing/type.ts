export enum LandingPageVariant {
	LAUNCH_AI_FOCUSED = "launch-ai-focused",
	AI_DEEP_UNDERSTANDING_FOCUSED = "ai-deep-understanding-focused",
	LAUNCH_REACT_FOCUSED = '"launch-react-focused',
}

export interface LaunchAiProps {
	affiliateId?: string;
	landingPageVariant: LandingPageVariant;
}
