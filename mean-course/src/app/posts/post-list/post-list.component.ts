import { PostsService } from './../posts.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})


export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = []
  private postsSubscriber : Subscription;

  constructor(private postService: PostsService) {

  }
  ngOnDestroy(): void {
    this.postsSubscriber.unsubscribe();
  }

  ngOnInit(): void {
     this.postService.getPosts();
    this.postsSubscriber = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[])=>{
      this.posts = posts;
    })
  }

  onDelete(postId: string){
    this.postService.deletePost(postId)
  }

}
