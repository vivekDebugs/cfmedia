import React, { useState } from 'react'
import { ActionType } from '../reducer'
import { useStateValue } from '../StateProvider'
import './PostModal.css'
import { storage } from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { getRandomInt } from '../utils/utils'
import { BsFillImageFill } from 'react-icons/bs'
import ProgressBar from './ProgressBar'

interface IProps {
	handleSubmit: (
		e: React.FormEvent<HTMLFormElement>,
		title: string,
		content: string,
		imageURL: string
	) => Promise<void>
}

const PostModal: React.FC<IProps> = ({ handleSubmit }): React.ReactElement => {
	const {
		state: { showAddPost, user },
		dispatch,
	} = useStateValue()
	const [title, setTitle] = useState<string>('')
	const [content, setContent] = useState<string>('')
	const [imageURL, setImageURL] = useState<string>('')
	const [progress, setProgress] = useState<number>(0)

	const handleClose = () => {
		dispatch({
			type: ActionType.SET_SHOW_ADD_POST,
			payload: false,
		})
	}

	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const randomInt = getRandomInt()
			const file = e.target.files![0]
			const fileRef = ref(storage, `${file.name}__${randomInt}`)
			const uploadTask = uploadBytesResumable(fileRef, file)
			uploadTask.on(
				'state_changed',
				snapshot => {
					const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
					setProgress(prog)
				},
				error => {},
				async () => {
					const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
					setImageURL(downloadURL)
				}
			)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div className={`modal ${showAddPost && 'show'}`} onClick={handleClose}>
			<div className='modal__content' onClick={e => e.stopPropagation()}>
				<form
					method='POST'
					onSubmit={e => handleSubmit(e, title, content, imageURL)}
				>
					<input
						type='text'
						name='title'
						value={title}
						onChange={e => setTitle(e.target.value)}
						placeholder='Add title...'
						autoComplete='off'
						autoFocus
					/>
					<textarea
						name='content'
						value={content}
						onChange={e => setContent(e.target.value)}
						placeholder='Write your thoughts...'
					/>
					{imageURL.length ? (
						<img
							src={imageURL}
							alt={user?.fullName}
							className='modal__mediaPreview'
						/>
					) : null}
					<br />
					<input
						type='file'
						accept='image/*'
						id='inputFile'
						style={{ display: 'none' }}
						onChange={e => onFileChange(e)}
					/>
					{progress === 0 || progress === 100 ? null : (
						<ProgressBar progress={progress} />
					)}
					<div className='modal__footer'>
						<label htmlFor='inputFile' className='modal__filePicker'>
							<BsFillImageFill size={30} />
						</label>
						<input type='submit' value='Post' />
					</div>
				</form>
			</div>
		</div>
	)
}

export default PostModal
