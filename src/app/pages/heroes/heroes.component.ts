import { Component, OnInit } from '@angular/core';
import { HeroesService } from 'src/app/services/heroes.service';
import { HeroeModel } from 'src/app/models/heroe.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: HeroeModel[] = [];

  cargando = false;

  constructor( private heroesService: HeroesService) { }

  ngOnInit() {

    this.cargando = true;

    //Inicializo la obtención de datos de héroes.
    this.heroesService.getHeroes()
      .subscribe( resp => {
        this.heroes = resp;
        this.cargando = false;
      });

  }
  
  borrarHeroe( heroe: HeroeModel, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ heroe.nombre }`,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      //Si la respuesta es True, esto es cierto, sinó ignora los cambios
      if( resp.value ) {
        //Borro una posición del arreglo, Angular se encargará de renderizar los héroes
        this.heroes.splice(i, 1);

        this.heroesService.borrarHeroe( heroe.id ).subscribe();
      }

    });

    
  }
}
