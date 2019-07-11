import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { map, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url = 'https://login-app-f9f38.firebaseio.com';

  constructor( private http: HttpClient) {


  }

  crearHeroe( heroe: HeroeModel) {

    //Retorna el Id de héroe, esto es un método observable
    return this.http.post(`${ this.url }/heroes.json`, heroe)
            .pipe(
              //Método "pipe" de los observables
              map( (resp:any) => {
                //El map recibe la respuesta de la petición, lo que responda http.post en este caso (Id)
                heroe.id = resp.name;
                return heroe; //Retorna el héroe ya manipulado (una instancia)
              })
            );

    //El operador "map" transforma lo que un observable puede regresar
  }

  actualizarHeroe( heroe: HeroeModel ) {

    //Creo una constante temporal que almacenará los datos de Héroe
    const heroeTemp = {
      ...heroe
    };

    //El id de héroe temporal lo elimino
    delete heroeTemp.id;

    return this.http.put(`${ this.url }/heroes/${ heroe.id }.json`, heroeTemp);
  }

  borrarHeroe( id: string ) {

    return this.http.delete(`${ this.url }/heroes/${ id }.json`)

  }

  getHeroe( id: string ) {
    return this.http.get( `${ this.url }/heroes/${ id }.json` );
  }

  getHeroes() {
    return this.http.get(`${ this.url }/heroes.json`)
            .pipe(
              map( this.crearArreglo ),
              delay(1500)
            );
  }

  private crearArreglo( heroesObj: object ) {

    const heroes: HeroeModel[] = [];

    //Hago un recorrido de obj y le asigno un "key"
    Object.keys( heroesObj ).forEach( key => {

      //Extraigo el objeto y lo asigno a una referencia
      const heroe: HeroeModel = heroesObj[key];

      heroe.id = key;

      //Almaceno los héroes en el arreglo
      heroes.push( heroe );

    });

    //Si no hay información en la base de datos
    if ( heroesObj === null ) { return []; }

    return heroes;
  }

}
