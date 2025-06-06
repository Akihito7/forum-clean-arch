import { BaseUseCaseInterface } from "src/shared/application/use-cases/base-use-case";
import { PostRepositoryInterface } from "../../domain/repositories/post.repository.interface";

export namespace GetManyPost {

  export type Output = Post[]

  type Post = {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt?: Date;
    updatedAt?: Date;
    tags?: string[];
    likes?: number;
  }

  export class UseCase implements BaseUseCaseInterface<any, Output> {

    constructor(private readonly postRepository: PostRepositoryInterface) { }

    async execute(): Promise<Output> {
      const posts = await this.postRepository.findMany();

      return posts.map(post => post.toJson());

    }
  }
}