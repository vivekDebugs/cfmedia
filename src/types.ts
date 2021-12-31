export enum Action {
	UPVOTE,
	DOWNVOTE,
}

export interface IPost {
	id: number
	username: string
	title: string
	content: string
	mediaURL?: string
	date: string
	comments: IComment[]
	reactions: IReactions
	actions: {
		[Action.UPVOTE]: number
		[Action.DOWNVOTE]: number
	}
}

export enum Reaction {
	LAUGH,
	LOVE,
	ANGRY,
	SAD,
}

interface IReactions {
	[Reaction.LAUGH]: number
	[Reaction.ANGRY]: number
	[Reaction.LOVE]: number
	[Reaction.SAD]: number
}

export interface IComment {
	id: number
	username: string
	postId: number
	comment: string
	date: string
}

export interface IUser {
	id: number
	username: string
	password: string
	fullName: string
	actions: IActions[]
}

export interface IActions {
	postId: number
	action: Action.UPVOTE | Action.DOWNVOTE | null
	reaction:
		| Reaction.LAUGH
		| Reaction.ANGRY
		| Reaction.LOVE
		| Reaction.SAD
		| null
}

export type IconType = (props: { size: number }) => JSX.Element

export interface IFooterIcons {
	id: number
	icon: IconType
	count?: number
}
