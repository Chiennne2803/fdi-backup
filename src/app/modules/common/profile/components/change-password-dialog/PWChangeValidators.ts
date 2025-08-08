import {FormControl, FormGroup} from '@angular/forms'
export class PWChangeValidators {

    /*static OldPasswordMustBeCorrect(control: FormControl) {
        var invalid = false;
        if (control.value != PWChangeValidators.oldPW)
            return { oldPasswordMustBeCorrect: true }
        return null;
    }*/

    // Our cross control validators are below
    // NOTE: They take in type FormGroup rather than FormControl
    static newIsNotOld(group: FormGroup){
        var newPW = group.controls['newPasswd'];
        if(group.controls['passwd'].value == newPW.value)
            newPW.setErrors({ newIsNotOld: true });
        return null;
    }

    static newMatchesConfirm(group: FormGroup){
        var confirm = group.controls['reNewPasswd'];
        if(group.controls['newPasswd'].value !== confirm.value)
            confirm.setErrors({ newMatchesConfirm: true });
        return null;
    }
}
