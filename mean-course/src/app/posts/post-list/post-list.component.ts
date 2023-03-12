import { PostsService } from './../posts.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})


export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = []
  private postsSubscriber : Subscription;
  isLoading: boolean = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10];

  constructor(private postService: PostsService) {

  }
  ngOnDestroy(): void {
    this.postsSubscriber.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSubscriber = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[])=>{
      this.posts = posts;
      this.isLoading = false;
    })
  }

  onChangedPage(pageData: PageEvent){
    console.log(pageData);
  }

  onDelete(postId: string){
    this.postService.deletePost(postId)
  }

}
