import { AuthService } from './../../auth/auth.service';
import { Subscription } from 'rxjs';
import { PostsService } from './../posts.service';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

// import { Post } from '../post.model';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit, OnDestroy {

  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  isLoading = false;
  post: Post;
  form: FormGroup;
  imagePreview: string;
  private authStatusSub: Subscription

  constructor(private postService: PostsService, public route: ActivatedRoute, private authService: AuthService) { }


  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe({
      next: (authStatus)=>{
        this.isLoading = false;
      }
    })
    this.form = new FormGroup({
      title: new FormControl(
        null,
        { validators: [Validators.required, Validators.minLength(3)] }
      ),
      content: new FormControl(
        null,
        { validators: [Validators.required] }
      ),
      image: new FormControl(
        null,
        { validators: [Validators.required], asyncValidators: [mimeType] }
      )
    });


    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(
          (postData) => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator
            }
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            })
          }
        )

      } else {
        this.mode = 'create'
        this.postId = null;
      }
    })
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file })
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  onSavePost() {
    if (this.form.invalid) return
    this.isLoading = true
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      )
    }


    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe()
  }

}
