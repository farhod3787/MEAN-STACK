import { Component,  OnInit,  } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../post.service';
import { Post } from '../post.model';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
 enterTitle = ''
 enterContent = ''
 post: Post;
 isLoad = false;

 form: FormGroup;
 imagePreview : any;

private mode = 'create'  
private postId: string


  constructor( public postsService: PostsService , public route: ActivatedRoute) { }

  ngOnInit() {  
      this.form = new FormGroup({
      name : new FormControl(null, { 
        validators: [ Validators.required, Validators.minLength(3) ] 
      }),
      price : new FormControl(null, {validators: [ Validators.required]}),
      image : new FormControl(null, { validators : [Validators.required]})
    });
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoad = true;
        this.postsService.getPost1(this.postId).subscribe(postData => {
          this.isLoad = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });


  }

  onInputChange(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader()  ;
    reader.onload = () =>{
    this.imagePreview = reader.result;                   // rasm tanlanganda ko'rsatish
    }
    reader.readAsDataURL(file);
  }
 

  onSavePost() {
    if (this.form.invalid) {
      return ;
    }
    this.isLoad = true
    if(this.mode === 'create') {
      this.postsService.addPost( 
        this.form.value.name, 
        this.form.value.price, 
        this.form.value.image )
    }
    else {
      this.postsService.updatePost(
        this.postId, 
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image
        )
    }
    this.form.reset();    
  }
}
