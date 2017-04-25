import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { WalkthroughPage } from '../pages/walkthrough/walkthrough';
import { AuthPage } from '../pages/auth/auth';
import { MenuPage } from '../pages/menu/menu';
import { DetailModal } from '../pages/menu/detail';
import { HomePage } from '../pages/home/home';
import { HowitworksPage } from '../pages/howitworks/howitworks';
import { HowModal} from '../pages/howitworks/hiw';
import { WhyModal} from '../pages/howitworks/whyus';
import { DaftarPage} from '../pages/daftar/daftar';
import { WelcomePage} from '../pages/welcome/welcome';

import { SubsHomePage, SubsMenuPage } from '../pages/subshome/subshome';
import { SubsOrderPage, EditOrderAddress } from '../pages/subsorder/subsorder';
import { SubsSaldoPage } from '../pages/subssaldo/subssaldo';
import { SubsProfilePage, SubsEditPage,SubsProfileEditPage } from '../pages/subsprofile/subsprofile';

import { SaldoVAPage,SaldoBrowserPage } from '../pages/subssaldo/saldova';
import { SignupPage } from '../pages/signup/signup';
import { ProfilePage, EditProfile } from '../pages/profile/profile';
import { FeedbackPage } from '../pages/feedback/feedback';

import { SubscribeService } from '../providers/subscribe-service';
import { Subsstep1Page } from '../pages/subscribe/subscribe';
import { Subsstep2Page } from '../pages/subscribe/subsstep2';
import { Subsstep3Page } from '../pages/subscribe/subsstep3';
import { SubssummaryPage } from '../pages/subscribe/subssummary';
import { SubsthanksPage } from '../pages/subscribe/substhanks';

import { TrialthanksPage } from '../pages/trial/trialthanks';
import { TrialStep1Page } from '../pages/trial/trials1';
import { TrialStep2Page } from '../pages/trial/trials2';
import { TrialStep3Page } from '../pages/trial/trials3';
import { TrialStep4Page } from '../pages/trial/trials4';
import { EditOrderPage } from '../pages/order/editorder';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { Mixpanel,MixpanelPeople } from '@ionic-native/mixpanel';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Market } from '@ionic-native/market';

import 'intl';
import 'intl/locale-data/jsonp/en';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'a2fa45cd'
  },
  'auth': {
    'google': {
      'webClientId': '184044806465-0n70rkkn8di2h5s35p64n4lr51ugvrfc.apps.googleusercontent.com'
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    AuthPage, SubsProfilePage, SubsEditPage, SubsProfileEditPage, SubsMenuPage, WelcomePage,
    MenuPage, DetailModal,ProfilePage, EditProfile, HowitworksPage, HowModal, WhyModal,
    HomePage, SubsHomePage, EditOrderPage, FeedbackPage, WalkthroughPage,
    SubsOrderPage,EditOrderAddress, SubsSaldoPage, DaftarPage,
    SignupPage, SaldoVAPage, SaldoBrowserPage,
    Subsstep1Page, Subsstep2Page,Subsstep3Page, SubssummaryPage, SubsthanksPage,
    TrialStep1Page, TrialStep2Page, TrialStep3Page, TrialStep4Page, TrialthanksPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: { backButtonText: '',
               backButtonIcon: 'ios-arrow-back',
               iconMode: 'ios'}
      }
    }),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AuthPage, SubsProfilePage, SubsEditPage, SubsProfileEditPage, SubsMenuPage, WelcomePage,
    MenuPage, DetailModal,ProfilePage, EditProfile, HowitworksPage, HowModal, WhyModal,
    HomePage, SubsHomePage, EditOrderPage, FeedbackPage, WalkthroughPage,
    SubsOrderPage,EditOrderAddress, SubsSaldoPage, DaftarPage,
    SignupPage, SaldoVAPage, SaldoBrowserPage,
    Subsstep1Page, Subsstep2Page,Subsstep3Page, SubssummaryPage, SubsthanksPage,
    TrialStep1Page, TrialStep2Page, TrialStep3Page, TrialStep4Page, TrialthanksPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    InAppBrowser,
    Mixpanel,MixpanelPeople,
    Market,
    SubscribeService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
