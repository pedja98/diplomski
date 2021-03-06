import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditUserDto } from 'src/app/dto/editUserDto';
import { userTypes } from 'src/app/metadata/metadata';
import { UserService } from 'src/app/services/user/user.service';
import {
  endsWithwhitespaceValidator,
  startsWithwhitespaceValidator,
  whitespaceValidator,
} from 'src/app/validators/whitespace.validator';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css'],
})
export class EditUserDialogComponent implements OnInit {
  form: FormGroup;
  resMsg = '';
  userOriginalValue: EditUserDto | null;
  readonly userTypes = userTypes;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private FormBuilder: FormBuilder,
    private _user: UserService,
    private dialogRef: MatDialogRef<EditUserDialogComponent>
  ) {
    this.userOriginalValue = data.user;
    let dateStr = new Date(this.data.user.dateOfBirth).toISOString();
    dateStr = dateStr.substring(0, dateStr.indexOf('T'));
    this.form = this.FormBuilder.group({
      firstName: [
        data.user.firstName,
        [
          Validators.required,
          whitespaceValidator,
          startsWithwhitespaceValidator,
          endsWithwhitespaceValidator,
        ],
      ],
      lastName: [
        data.user.lastName,
        [
          Validators.required,
          whitespaceValidator,
          startsWithwhitespaceValidator,
          endsWithwhitespaceValidator,
        ],
      ],
      email: [data.user.email, [Validators.required, Validators.email]],
      type: [data.user.type, Validators.required],
      dateOfBirth: [dateStr, Validators.required],
    });
  }

  onChange(): void {
    if (this.resMsg != '') {
      this.resMsg = '';
    }
  }

  change() {
    this.resMsg = '';
    if (this.form.valid) {
      if (
        this.form.value['firstName'] === this.userOriginalValue?.firstName &&
        this.form.value['lastName'] === this.userOriginalValue?.lastName &&
        this.form.value['email'] === this.userOriginalValue?.email &&
        this.form.value['type'] === this.userOriginalValue?.type &&
        String(this.userOriginalValue?.dateOfBirth).includes(
          this.form.value['dateOfBirth']
        )
      ) {
        return;
      }
      this._user
        .editUser(this.form.value, this.data.user.id)
        .subscribe((res) => {
          this.resMsg = res.faild;
          if (res.success) {
            this.dialogRef.close({ msg: 'updated' });
          }
        });
    }
  }

  ngOnInit(): void {}
}
