import React, { useEffect } from 'react'
import { BsPlusLg } from 'react-icons/bs'
import Post from '../components/Post'
import PostModal from '../components/PostModal'
import { ActionType } from '../reducer'
import { Action, IPost, Reaction } from '../types'
import { useStateValue } from '../StateProvider'
import { url } from '../App'
import './Home.css'
import { AiOutlinePoweroff } from 'react-icons/ai'
import { useParams, Link } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'

interface IProps {
	userPosts?: boolean
}

const Home: React.FC<IProps> = ({ userPosts }): React.ReactElement => {
	const { username } = useParams<{ username: string }>()

	const {
		state: { posts, showAddPost, user },
		dispatch,
	} = useStateValue()

	const getPosts = async () => {
		try {
			const res = await fetch(`${url}/posts`)
			const data = await res.json()
			dispatch({
				type: ActionType.SET_POSTS,
				payload: data,
			})
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		getPosts()
		// eslint-disable-next-line
	}, [])

	const handleSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
		title: string,
		content: string,
		imageURL: string
	) => {
		try {
			e.preventDefault()
			if (!title || !content) return
			const newPost: IPost = {
				id: Date.now(),
				username: user!.username,
				title: title,
				content: content,
				mediaURL: imageURL,
				date: new Date().toString(),
				comments: [],
				actions: {
					[Action.UPVOTE]: 0,
					[Action.DOWNVOTE]: 0,
				},
				reactions: {
					[Reaction.LAUGH]: 0,
					[Reaction.ANGRY]: 0,
					[Reaction.LOVE]: 0,
					[Reaction.SAD]: 0,
				},
			}
			const res = await fetch(`${url}/posts`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: '*/*',
				},
				body: JSON.stringify(newPost),
			})
			const data = await res.json()
			dispatch({
				type: ActionType.SET_SHOW_ADD_POST,
				payload: false,
			})
			dispatch({
				type: ActionType.SET_POSTS,
				payload: [...posts, data],
			})
		} catch (error) {
			let err: any = {}
			if (error instanceof Error) err = error
			console.log(err)
		}
	}

	const handleLogout = () => {
		sessionStorage.clear()
		dispatch({
			type: ActionType.SET_USER,
			payload: null,
		})
	}

	return (
		<div className='home'>
			{userPosts ? (
				<>
					<Link to='/' className='home__navButton nav'>
						<AiFillHome />
					</Link>
					<h2 className='home__username'>{username}</h2>
				</>
			) : (
				<div
					onClick={() =>
						dispatch({
							type: ActionType.SET_SHOW_ADD_POST,
							payload: true,
						})
					}
					className='home__addPost'
				>
					<BsPlusLg /> <span>Add Post</span>
				</div>
			)}

			{showAddPost ? <PostModal handleSubmit={handleSubmit} /> : null}

			{posts.length ? (
				posts
					.filter((p: IPost) => {
						if (userPosts) return p.username === username
						else return true
					})
					.sort((a: IPost, b: IPost) => {
						const netUpvotesOfA =
							a.actions[Action.UPVOTE] - a.actions[Action.DOWNVOTE]
						const netUpvotesOfB =
							b.actions[Action.UPVOTE] - b.actions[Action.DOWNVOTE]
						if (netUpvotesOfA < netUpvotesOfB) return 1
						else return -1
					})
					.map((post: IPost) => {
						return <Post post={post} key={post.id} />
					})
			) : (
				<h2>No Posts yet. Add some</h2>
			)}
			<div className='home__logout' onClick={handleLogout}>
				<AiOutlinePoweroff />
				<span>Logout</span>
			</div>
		</div>
	)
}

export default Home
