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
static newIsNotOld(group: FormGroup) {
  const oldPW = group.controls['passwd'].value;
  const newPW = group.controls['newPasswd'];

  if (!newPW.value) {
    if (newPW.errors && newPW.errors['newIsNotOld']) {
      const { newIsNotOld, ...otherErrors } = newPW.errors;
      newPW.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }
    return null;
  }

  if (oldPW && newPW.value === oldPW) {
    newPW.setErrors({ ...newPW.errors, newIsNotOld: true });
  } else {
    if (newPW.errors && newPW.errors['newIsNotOld']) {
      const { newIsNotOld, ...otherErrors } = newPW.errors;
      newPW.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
    }
  }

  return null;
}

    static newMatchesConfirm(group: FormGroup){
        var confirm = group.controls['reNewPasswd'];
        if(group.controls['newPasswd'].value !== confirm.value)
            confirm.setErrors({ newMatchesConfirm: true });
        return null;
    }
}
