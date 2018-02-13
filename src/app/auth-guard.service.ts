import { CanActivate } from "@angular/router/src/interfaces";
import { ActivatedRouteSnapshot, RouterStateSnapshot,Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { RestApiService } from "./services/rest-api.service";
import { Cookie } from "ng2-cookies";

@Injectable()
export class CanAuthGuard implements CanActivate{
    /**
     * home页面的路由守卫
     * 一刷新就会把cookie清空，所以不能验证通过登录，于是就重新登录，登录后isLoggedIn=true，通过访问权限
     */
    constructor(private restApiService:RestApiService,private router:Router,private restApi:RestApiService){}
    canActivate(router:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean{
        let url:string=state.url;
        console.log('stateUrl:'+state.url+'访问权限验证：'+this.checkLogin(url));
        return this.checkLogin(url);
    }
    checkLogin(url){
        let token = this.restApi.getQueryString('access_token');
        console.log('访问验证的前url'+window.document.referrer);
        if(this.restApiService.isLoggedIn){return true;}
        //else{Cookie.deleteAll();}
        //this.restApiService.redirect_uri=url;
        //this.router.navigateByUrl("/");
        //Cookie.deleteAll();
    }
}