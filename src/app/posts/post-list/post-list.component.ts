import { Component, OnInit, OnDestroy  } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs'
import { Post } from './../post.model';
import { PostsService } from './../post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts : Post [] =  []
  isLoad = false;
  private postSub : Subscription;
  totalPost = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOption = [1, 2, 5, 10];

  constructor(public postsService : PostsService) { 
 
  }

  ngOnInit() {
    this.isLoad = true;
    this.postsService.getPost(this.postsPerPage, this.currentPage)
    this.postSub = this.postsService.getPostUpdateListener()
      .subscribe( (posts: Post[]) =>{
          this.posts = posts;
          this.isLoad = false;
      } )
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPost(this.postsPerPage, this.currentPage);
  }

  delete(id: string) {
    this.isLoad = false;
       this.postsService.deletePost(id).subscribe( () =>{
         this.postsService.getPost(this.postsPerPage, this.currentPage)
       });
  }

  ngOnDestroy () {
    this.postSub.unsubscribe()  
  }  

  ok(value) {
    console.log(value)
  }

}
