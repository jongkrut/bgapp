import { Injectable } from '@angular/core';

export interface User {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}
export interface Subscribe {
    city: string;
    delivery_day: string;
    portion: string;
    menu_total: string;
    menu_id: string;
    subscription_start: string;
    subscription_end: string;
}

@Injectable()
export class SubscribeService {
   currentUser: User;
   subscribeData: Subscribe;
   private subscribe = {};
   error: string;

   constructor() {
   }
   public saveSubscribe(subscribeData): void {
     this.subscribe = subscribeData;
   }
   public getSubscribe(): {} {
     return this.subscribe;
   }

}
