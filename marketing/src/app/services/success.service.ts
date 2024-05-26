import { Injectable } from '@angular/core';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root',
})
export class SuccessService {
  constructor(private swal: SwalService) {}

  successHandler(err: number) {
    switch (err) {
      case 200:
        this.swal.callToast('İşleminiz başarıyla gerçekleşti', 'success');
        break;
      case 201:
        this.swal.callToast('Giriş işleminiz başarılı', 'success');
        break;
      case 202:
        this.swal.callToast('Kayıt işleminiz başarılı', 'success');
        break;
    }
  }
}
