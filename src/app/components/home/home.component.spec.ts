import { ComponentFixture, TestBed, ComponentFixtureAutoDetect, async, inject } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
import { RestApiService } from "../../services/rest-api.service";
import { HomeComponent, DialogComponent, ConfirmComponent, AlertComponent } from "./home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { 
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogModule,
    MatIconModule,
    MAT_DIALOG_DEFAULT_OPTIONS,
    MatInputModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatTableModule,
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialog,
  } from "@angular/material";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe('HomeComponent tests',()=>{
    let comp:HomeComponent;
    let fixture:ComponentFixture<HomeComponent>;
    let de:DebugElement;
    let el:HTMLElement;
    let restApiService:RestApiService;
    let restApiServiceStub:{
        isLoggedIn:boolean;
        user:{name:string}
    };

    let dialog:MatDialog;

    let matDialogData:{
        batch:string;
        model:string;
        production_date:string;
        deliver_date:string;
        relevancy_party:string;
        batch_comment:string;
    };
    let dialogRef:any;
    beforeEach(async(()=>{
        restApiServiceStub={
            isLoggedIn:true,
            user:{name:'zy'}
        };
        matDialogData={
            batch:"CL201709060000",
            model:"DT20220",
            production_date:"2011-11-11",
            deliver_date:"2012-12-12",
            relevancy_party:"A科技公司",
            batch_comment:"根本不偶是",
        };
        
        
        TestBed.configureTestingModule({
            imports:[ FormsModule,ReactiveFormsModule, 
                MatButtonModule,
                MatNativeDateModule,
                MatDatepickerModule,
                MatSelectModule,
                MatDialogModule,
                MatIconModule,
                MAT_DIALOG_DEFAULT_OPTIONS,
                MatInputModule,
                MatCheckboxModule,
                MatAutocompleteModule,
                MatTableModule,
                BrowserDynamicTestingModule,
                BrowserAnimationsModule,
            ],
            declarations:[HomeComponent,DialogComponent,ConfirmComponent,AlertComponent],
            providers:[
                {provide:ComponentFixtureAutoDetect,useValue:true},
                {provide:RestApiService,useValue:restApiServiceStub},
                {provide:MAT_DIALOG_DATA,useValue:matDialogData},
                {provide:MatDialogRef,useValue:dialogRef},
            ]
        }).compileComponents();

        restApiService=TestBed.get(RestApiService);
        
    }));
    beforeEach(()=>{
        fixture=TestBed.createComponent(HomeComponent);
        
        comp=fixture.componentInstance;

        de=fixture.debugElement.query(By.css('mat-table'));
        el=de.nativeElement;
    });
    it('create Component',()=>{
        expect(comp).toBeDefined()
    });
    it('have table',()=>{
        fixture.detectChanges();
        const table=de.nativeElement;
        expect(table.textContent).toMatch(/angular/i);
    })
});