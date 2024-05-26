import { Injectable } from '@angular/core';
import { SwalService } from './swal.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private swal: SwalService
  ) { }

  errorHandler(err:number){
    console.log(err);

    switch (err) {
      case 0:
        this.swal.callToast("Geçersiz kullanıcı adı veya şifre","error");
        break;        
      
      case 1:
        this.swal.callToast("Kayıt ekleme sırasında bir hata oluştu","error");
        break;
    
      case 404:
        this.swal.callToast("API adresi bulunamadı","error")
        break;
        
      case 500:
        this.swal.callToast("İşleminiz başarıyla gerçekleşti","success");
        break;

        case 501:
          this.swal.callToast("Giriş işleminiz başarılı","success");
          break;
      
    }    
  }
}
