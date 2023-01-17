import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewEncapsulation } from '@angular/core';
import { BaseModel } from './model/base.model';
import { CommonService } from './services/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScoopModel } from './model/scoop.model';
import { OrderedScoopModel } from './model/ordered-scoop-model';
import { ResponseModel } from './model/response.model';
import { IceCreamFlavour } from './model/ice-cream-flavour';
import { IceCreamBase } from './model/ice-cream-base';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  @ViewChild('stepper', { read: MatStepper }) stepper: MatStepper;

  title = 'iceCream-parlour-app';
  userName: string;
  totalCost: number = 0;
  scoopTotalCost: number = 0;
  finalBaseObj: BaseModel;
  scoopLimit = 4;
  subscription: Subscription;
  orderedScoopList: Array<OrderedScoopModel> = [];
  orderedFlavourList: Array<string> = [];
  isValidScoopCount: boolean;
  private userFormGroupSub: Subscription;
  private flavourFormGroupSub: Subscription;

  users = [
    { id: "1", name: "Alanna Mosvani" },
    { id: "2", name: "Mat Cauthon" },
    { id: "3", name: "Moiraine Damodred" }
  ] as const;

  flavours = [
    { value: "vanilla", label: "Vanilla", recordName: 'Vanilla' },
    { value: "cookiesAndCream", label: "Cookies And Cream", recordName: 'CookiesAndCream' },
    { value: "chocolate", label: "Chocolate", recordName: 'Chocolate' },
    { value: "mintChocolateChip", label: "Mint Chocolate Chip", recordName: 'MintChocolateChip' },
    { value: "strawberry", label: "Strawberry", recordName: 'Strawberry' },
    { value: "cookieDough", label: "Cookie Dough", recordName: 'CookieDough' },
    { value: "mooseTracks", label: "Moose Tracks", recordName: 'MooseTracks' },
  ] as const;

  coneBaseList = [
    { name: "Cup", value: "cup", price: 3, recordName: "Cup" },
    { name: "Cake Cone", value: "cakeCone", price: 3, recordName: "CakeCone" },
    { name: "Sugar Cone", value: "sugarCone", price: 3, recordName: "SugarCone" },
    { name: "Waffle Cone", value: "waffleCone", price: 4, recordName: "WaffleCone" }
  ] as const;

  scoops = [
    { count: 1, price: 2 },
    { count: 2, price: 3 },
    { count: 3, price: 3.50 },
    { count: 4, price: 3.80 },
  ] as const;

  constructor(private _formBuilder: FormBuilder, breakpointObserver: BreakpointObserver, private commonService: CommonService,
    private _snackBar: MatSnackBar) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  userFormGroup = this._formBuilder.group({ //initializing user form group
    customerName: ['', Validators.required],
    base: ['', Validators.required],
  });

  flavoursFormGroup = this._formBuilder.group({ //initializing flavours form group
    vanilla: [],
    chocolate: [],
    strawberry: [],
    mooseTracks: [],
    cookiesAndCream: [],
    mintChocolateChip: [],
    cookieDough: [],

  });

  stepperOrientation: Observable<StepperOrientation>;

  getTotalScoops(scoops: object) { //returning total scoop count 
    let totalCount: number = 0;
    Object.values(scoops)?.forEach((item: number) => {
      if (typeof item === "number") {
        totalCount += item;
      };
    });
    return totalCount;
  }

  ngOnInit() {
    this.flavourFormChangeHandler();
    this.userFormChangeHandler();
  }

  triScoopDisableValidation(flavour1: number, flavour2: number, disableFormControl: boolean) :boolean{ //check for tri scoop scenario to disable form control
    return (typeof flavour1 === "number" && flavour1 > 0) &&
      (typeof flavour2 === "number" && flavour2 > 0) &&
      !disableFormControl;
  }

  triScoopEnableValidation(flavour1: number, flavour2: number, enableFormControl: boolean) : boolean{ //check for tri scoop scenario to enable form control
    return (typeof flavour1 !== "number" || typeof flavour2 !== "number") && enableFormControl;
  }

  isFormControlEnable(formControlValue: number, formControlEnable: boolean): boolean { //check to enable form control
    return (typeof formControlValue !== "number") && formControlEnable;
  }

  isFormControlDisable(formControlValue: number, formControlDisable: boolean): boolean { //check to disable form control
    return ((typeof formControlValue === "number") && formControlValue > 0) && !formControlDisable;
  }

  userFormChangeHandler() {
    this.userFormGroupSub = this.userFormGroup.valueChanges.subscribe((result) => { //watching user formGroup for changes
      this.userName = result?.customerName;
      if (result?.base === "cup") {
        this.scoopLimit = 4;
      } else {
        this.scoopLimit = 3;
      }

      if (result?.base === "sugarCone") {
        this.flavoursFormGroup.get('cookieDough').disable();
      } else {
        this.flavoursFormGroup.get('cookieDough').enable();
      }
    }
    );
  }

  flavourFormChangeHandler() {
    this.flavourFormGroupSub = this.flavoursFormGroup.valueChanges.subscribe((result) => { //watching flavours formGroup for changes

      let totalScoop = this.getTotalScoops(result);
      this.isValidScoopCount = (totalScoop <= this.scoopLimit && totalScoop > 0);
      let strawberryFormControl = this.flavoursFormGroup.get("strawberry");
      let mintChocolateChipFormControl = this.flavoursFormGroup.get("mintChocolateChip");
      let cookiesAndCreamFormControl = this.flavoursFormGroup.get("cookiesAndCream");
      let mooseTracksFormControl = this.flavoursFormGroup.get("mooseTracks");
      let vanillaFormControl = this.flavoursFormGroup.get("vanilla");

      this.flavours?.forEach((f) => {

        if (f?.value === "strawberry") {
          if (this.isFormControlDisable(strawberryFormControl?.value, mintChocolateChipFormControl.disabled)) {
            mintChocolateChipFormControl.disable();
          } else if (this.isFormControlEnable(strawberryFormControl?.value, mintChocolateChipFormControl.disabled)) {
            mintChocolateChipFormControl.enable();
          }
        }

        if (f?.value === "mintChocolateChip") {
          if (this.isFormControlDisable(mintChocolateChipFormControl?.value, strawberryFormControl.disabled)) {
            strawberryFormControl.disable();
          } else if (this.isFormControlEnable(mintChocolateChipFormControl?.value, strawberryFormControl.disabled)) {
            strawberryFormControl.enable();
          }
        }

        if (this.userFormGroup.get("base").value === "cakeCone") {
          if (f?.value === "cookiesAndCream") {
            if (this.triScoopDisableValidation(cookiesAndCreamFormControl?.value, mooseTracksFormControl?.value, vanillaFormControl?.disabled)) {
              vanillaFormControl.disable();
            } else if (this.triScoopEnableValidation(cookiesAndCreamFormControl?.value, mooseTracksFormControl?.value, vanillaFormControl.disabled)) {
              vanillaFormControl.enable();
            }
          }

          if (f?.value === "mooseTracks") {
            if (this.triScoopDisableValidation(mooseTracksFormControl?.value, vanillaFormControl?.value, cookiesAndCreamFormControl?.disabled)) {
              cookiesAndCreamFormControl.disable();
            } else if (this.triScoopEnableValidation(mooseTracksFormControl?.value, vanillaFormControl?.value, cookiesAndCreamFormControl.disabled)) {
              cookiesAndCreamFormControl.enable();
            }
          }

          if (f?.value === "vanilla") {
            if (this.triScoopDisableValidation(vanillaFormControl?.value, cookiesAndCreamFormControl?.value, mooseTracksFormControl?.disabled)) {
              mooseTracksFormControl.disable();
            } else if (this.triScoopEnableValidation(vanillaFormControl?.value, cookiesAndCreamFormControl?.value, mooseTracksFormControl.disabled)) {
              mooseTracksFormControl.enable();
            }
          }
        }
      });
    }
    );
  }

  getSelectedFlavours(scoopObj: object) { //returning selected scoop object
    let selectedScoopList = [];
    Object.keys(scoopObj)?.forEach((scoopFlavour: string) => {
      if (typeof scoopObj[scoopFlavour] === "number") {
        let selectedFlavour = this.flavours?.find(flavour => flavour?.value === scoopFlavour)
        selectedScoopList.push({
          name: selectedFlavour?.label,
          quantity: scoopObj[scoopFlavour],
          recordName: selectedFlavour?.recordName
        });
      };
    });
    return selectedScoopList;
  }

  onSubmitFlavour() {
    this.orderedFlavourList = [];
    let totalScoopCount = this.getTotalScoops(this.flavoursFormGroup.value);
    let scoopObj: ScoopModel;
    let baseObj: BaseModel;
    this.scoops?.filter(item => {
      if (item?.count === totalScoopCount) {
        scoopObj = item;
      }
    });
    baseObj = this.coneBaseList?.filter(item => item?.value === this.userFormGroup.value?.base)[0];
    this.orderedScoopList = this.getSelectedFlavours(this.flavoursFormGroup.value)
    this.orderedScoopList?.forEach((flavourObj: OrderedScoopModel) => {
      if (flavourObj?.name) {
        this.orderedFlavourList.push(IceCreamFlavour?.[flavourObj?.recordName]);
      }
    })
    this.scoopTotalCost = scoopObj?.price;
    this.totalCost = scoopObj?.price + baseObj?.price;
    this.finalBaseObj = baseObj;
  }

  clearFlavourForm() {
    this.flavoursFormGroup.reset();
  }

  resetForm() {
    this.flavoursFormGroup.reset();
    this.userFormGroup.reset();
  }

  placeOrder() { //placing order (post order API call)

    let payload = {
      paymentAmount: this.totalCost,
      flavours: this.orderedFlavourList,
      base: IceCreamBase?.[this.finalBaseObj?.recordName],
    };

    this.subscription = this.commonService.saveOrder(payload, this.userName).subscribe((response: any) => { //given url in readme.md file is not working hence created  
      if (response?.id >= 0) {

        setTimeout(() => {
          this.stepper.reset();
          this.resetForm();
        }, 4000);

        this._snackBar.open('Your order has been placed successfully!', 'Dismiss', {
          duration: 5000
        });
      }
    }, (error: HttpErrorResponse) => {
      this._snackBar.open(error?.error?.title, 'Dismiss', {
        duration: 3000
      });
    });
  }

  ngOnDestroy() {
    this.userFormGroupSub.unsubscribe();
    this.flavourFormGroupSub.unsubscribe();
  }
}
