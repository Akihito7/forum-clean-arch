import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req } from "@nestjs/common";
import { AddComment } from "../application/use-cases/add-comment.use-case";
import { GetCommentByPost } from "../application/use-cases/get-comment-by-post.use-case";
import { GetCommentAuthorInPost } from "../application/use-cases/get-comment-author-in-post.use-case";
import { GetCommentByAuthor } from "../application/use-cases/get-comment-by-author.use-case";
import { GetCommentByContent } from "../application/use-cases/get-comment-by-content.use-case";
import { ParamsGetCommentAuthorInPostDTO } from "./dto/get-comment-author-in-post.dto";
import { QueryCommentByContentDTO } from "./dto/get-comment-by-content.dto";
import { UpdateComment } from "../application/use-cases/update-comment.use-case";
import { DeleteComment } from "../application/use-cases/delete-comment.use-case";
import { UpdateCommentDTO } from "./dto/update-comment.dto";

@Controller('comment')
export class CommentController {

  @Inject(AddComment.UseCase)
  private readonly addCommentUseCase: AddComment.UseCase;

  @Inject(GetCommentAuthorInPost.UseCase)
  private readonly getCommentAuthorInPostUseCase: GetCommentAuthorInPost.UseCase;

  @Inject(GetCommentByAuthor.UseCase)
  private readonly getCommentByAuthorUseCase: GetCommentByAuthor.UseCase;

  @Inject(GetCommentByContent.UseCase)
  private readonly getCommentByContentUseCase: GetCommentByContent.UseCase;

  @Inject(GetCommentByPost.UseCase)
  private readonly getCommentByPostUseCase: GetCommentByPost.UseCase;

  @Inject(UpdateComment.UseCase)
  private readonly updateCommentUseCase: UpdateComment.UseCase;

  @Inject(DeleteComment.UseCase)
  private readonly deleteCommentUseCase: DeleteComment.UseCase;


  @Post('create')
  async createComment(@Req() req, @Body() body: any) {
    const userId = req.user.id;
    return this.addCommentUseCase.execute({
      ...body,
      authorId: userId,
    })
  }

  @Get(':postId/:authorId')
  async getCommentByAuthorInPost(@Param('') params: ParamsGetCommentAuthorInPostDTO) {
    const { postId, authorId } = params
    return this.getCommentAuthorInPostUseCase.execute({ postId, authorId })
  }

  @Get(':authorId')
  async getCommentByAuthor(@Param('authorId') authorId: string) {
    return this.getCommentByAuthorUseCase.execute({ authorId })
  }

  @Get('by-content')
  async getCommentByContent(@Query() query: QueryCommentByContentDTO) {
    const { content } = query;
    return this.getCommentByContentUseCase.execute({ content })
  }

  @Get(':postId')
  async getByPostId(@Param('postId') postId: string) {
    return this.getCommentByPostUseCase.execute({ postId })
  }

  @Put("/:id")
  async updateById(@Req() req, @Param("id") commentId: string, @Body() body: UpdateCommentDTO) {
    const userId = req.user.id;
    const { content } = body;
    return this.updateCommentUseCase.execute({ commentId, requesteredId: userId, content })
  }

  @Delete("/:id")
  async deleteById(@Req() req, @Param("id") commentId: string) {
    const userId = req.user.id;
    return this.deleteCommentUseCase.execute({ commentId, requesteredId: userId })
  }
}