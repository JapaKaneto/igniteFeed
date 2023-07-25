import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

import { Avatar } from './Avatar';
import { Comment } from './Comment';
import styles from './Post.module.css';
import { useState, FormEvent, ChangeEvent, InvalidEvent } from 'react';

interface Author {
    name: string;
    role: string;
    avatarUrl: string;
}


interface Content {
    type: 'paragraph' | 'link';
    content: string;
}

export interface PostType {
    id: number;
    author: Author;
    publisedAt: Date;
    content: Content[];
}

interface PostProps {
    post: PostType;
}

export function Post({ post }: PostProps) {
    const [comments, setComments ] = useState([
        "Post muito bacana, hein!!"
    ])

    const [ newCommentText, setNewCommentText ] = useState('')

    const publisedDateFormatted = format(post.publisedAt, "d 'de' LLLL 'às' H:mm'h'", {
        locale: ptBR,
    })

    const publisedDateRelativeToNow =  formatDistanceToNow(post.publisedAt, {
        locale: ptBR,
        addSuffix: true
    })

    function handleCreateNewComment(event : FormEvent ){
        event.preventDefault()

        setComments([...comments, newCommentText])

        setNewCommentText('')
    }

    function handleNewCommentChange(event : ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('');
        setNewCommentText(event.target.value);

    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('Esse campo é obrigatório');
    }

    function deleteComment(commentsToDelete: string) {
        const commentsWithoutDeleteOne = comments.filter(comments => {
            return comments !== commentsToDelete;
        })

        setComments(commentsWithoutDeleteOne);
    }

    const isNewCommentEmpty = newCommentText.length == 0

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar key={post.author.avatarUrl} src={post.author.avatarUrl} />
                    <div className={styles.authorInfo}>
                        <strong>{post.author.name}</strong>
                        <span>{post.author.role}</span>
                    </div>
                </div>

                <time title={publisedDateFormatted} dateTime={post.publisedAt.toISOString()}>{publisedDateRelativeToNow}</time>
            </header>
            <div className={styles.content} >
                {post.content.map(line => {
                    if (line.type == 'paragraph') {
                        return <p key={line.content}>{line.content}</p>;
                    } else if (line.type == 'link') {
                        return <p key={line.content}><a href="#">{line.content}</a></p>
                    }
                })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.comentForm}>
                <strong>Deixe seu Feedback</strong>
                <textarea 
                    name='comment'
                    placeholder='Deixe um comentário' 
                    value={newCommentText}
                    onChange={handleNewCommentChange}
                    onInvalid={handleNewCommentInvalid}
                    required
                />
                <footer>
                    <button type='submit'disabled={isNewCommentEmpty}>
                        Publicar
                    </button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comments => {
                    return (
                        <Comment 
                            key={comments} 
                            content={comments} 
                            onDeleteComment={deleteComment} 
                        />
                    )
                })}
            </div>
        </article>
    )
}