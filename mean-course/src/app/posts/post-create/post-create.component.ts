import { PostsService } from './../posts.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

// import { Post } from '../post.model';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {

  enteredTitle = '';
  enteredContent = '';

  constructor( private postService : PostsService){}

  ngOnInit(): void {

  }

  onAddPost(form: NgForm) {
    if(form.invalid) return
    this.postService.addPost(form.value.title,form.value.content);
    form.resetForm();
  }

}
