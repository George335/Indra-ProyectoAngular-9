import { Component, OnInit } from '@angular/core';
import { HeroeModel } from 'src/app/models/heroe.model';
import { NgForm } from '@angular/forms';
import { HeroesService } from 'src/app/services/heroes.service';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

  heroe = new HeroeModel();

  constructor(private heroesService: HeroesService, 
              private route: ActivatedRoute) { }

  ngOnInit() {

    //Obtiene el Id del Routing
    const id = this.route.snapshot.paramMap.get('id');

    //console.log(id);
    if ( id !== 'nuevo' ) {

      this.heroesService.getHeroe( id )
        .subscribe( (resp: HeroeModel) => {
          this.heroe = resp;
          this.heroe.id = id;
        });

    }

  }

  guardar(form: NgForm) {

    //Hace las validaciones con los campos en HTML
    if (form.invalid) {
      console.log('Formulario no válido');
      return;
    }

    let peticion: Observable<any>;

    //Mensaje tipo "Modal" que espera que registre o actualice
    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      type: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    // console.log(form);
    // console.log(this.heroe);

    //Validamos si el Id existe(retorna de la caja de texto)
    if (this.heroe.id) { //Si existe, actualiza.
      peticion = this.heroesService.actualizarHeroe(this.heroe);
        // .subscribe(resp => {
        //   console.log(resp);
        // });

    } else { //Si no existe, registra.
      peticion = this.heroesService.crearHeroe(this.heroe);
        // .subscribe(resp => {
        //   console.log(resp);
        //   this.heroe = resp; //La respuesta es un héroe(retorna el servicio un objeto héroe).
        // });
    }


    peticion.subscribe( resp => {

      Swal.fire({
        title: this.heroe.nombre,
        text: 'Se actualizó correctamente',
        type: "success"
      });

    })



  }

}
