import { BaseUseCaseInterface } from "src/shared/application/use-cases/base-use-case";
import { PostRepositoryInterface } from "../../domain/repositories/post.repository.interface";
import { NotFoundError } from "src/shared/domain/errors/not-found.error";
import { LikeRepositoryInterface } from "src/modules/likes/domain/repositories/like.repository.interface";
import { CommentRepositoryInterface } from "src/modules/comments/domain/repositories/comment.repository.interface";
import { UserRepositoryInterface } from "src/modules/users/domain/repositories/user.repository.interface";
import { LikeEntity } from "src/modules/likes/domain/entities/like.entity";

export namespace GetPost {

  export interface Input {
    id: string;
    userId?: string
  }

  export interface Output {
    authorUsername: string
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt?: Date;
    updatedAt?: Date;
    tags?: string[];
    likes: number;
    comments: {
      authorUsername: string
      postId: string;
      authorId: string;
      content: string;
      createdAt?: Date;
      updatedAt?: Date;
      likes?: number;
      likedByUser: boolean,
      currentUserLikeId: string | null
    }[];
  }

  export class UseCase implements BaseUseCaseInterface<Input, Output> {

    constructor(
      private readonly postRepository: PostRepositoryInterface,
      private readonly likeRepository: LikeRepositoryInterface,
      private readonly commentRepository: CommentRepositoryInterface,
      private readonly userRepository: UserRepositoryInterface
    ) { }

    async execute(input: Input): Promise<Output> {

      const { id, userId } = input;

      const post = await this.postRepository.findById(id);

      if (!post) throw new NotFoundError(`Post with this id ${id} not found.`);

      const author = await this.userRepository.findById(post.authorId);

      if (!author) throw new NotFoundError("Author of post not found");

      const likes = await this.likeRepository.countLikeByPost(post.id)

      const comments = await this.commentRepository.findByPostId(post.id);


      const commentsWithAuthorName = await Promise.all(comments.map(async comment => {
        const likesCount = await this.likeRepository.countLikeByCommment(comment.id)
        const author = await this.userRepository.findById(comment.authorId);

        const like = userId
          ? await this.likeRepository.getLikeByCommentAndAuthor(comment.id, userId)
          : null;

        const likedByUser = !!like;
        const likeIdByUser = like?.id ?? null;

        return {
          authorUsername: author ? author.username : 'unknow',
          likedByUser: likedByUser,
          currentUserLikeId: likeIdByUser,
          ...comment.toJson(),
          likes: likesCount
        }
      }))

      return {
        authorUsername: author.username,
        ...post.toJson(),
        comments: commentsWithAuthorName,
        likes
      }
    }
  }

}