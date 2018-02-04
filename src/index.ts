import {NgModule} from '@angular/core';
import {JTBCoreGamesUIBSAdminModule} from './admin/jtb.core.games.ui.bs.admin.module';
import {JTBCoreGamesUIBSSignInModule} from './sign-in/jtb.core.games.ui.bs.sign-in.module';
import {JTBCoreGamesUIBSActionsModule} from './actions/jtb.core.games.ui.bs.actions.module';
import {JTBCoreGamesUIBSSignedInModule} from './signed-in/jtb.core.games.ui.bs.signed-in.module';
import {JTBCoreGamesUIBSVersionNotesModule} from './version-notes/jtb.core.games.ui.bs.version-notes.module';
import {JTBCoreGamesUIBSAdsModule} from './ads/jtb.core.games.ui.bs.ads.module';
import {JTBCoreGamesUIBSBackdropModule} from './backdrop/jtb.core.games.ui.bs.backdrop.module';
import {JTBCoreGamesUIBSErrorsModule} from './errors/jtb.core.games.ui.bs.errors.module';
import {JTBCoreGamesUIBInviteModule} from './invite/jtb.core.games.ui.bs.invite.module';
import {JTBCoreGamesUI} from 'jtb-core-games-ui';

export {
  JTBCoreGamesUIBSAdminModule,
  AdminComponent,
  AdminSwitchPlayerComponent,
  AdminStatsComponent
} from './admin/jtb.core.games.ui.bs.admin.module';
export {
  JTBCoreGamesUIBSActionsModule,
  BootstrapActionsService,
  BootstrapRerouteService,
  DefaultActionErrorComponent,
  DefaultActionConfirmComponent
} from './actions/jtb.core.games.ui.bs.actions.module';
export {JTBCoreGamesUIBSAdsModule, BootstrapAdsService} from './ads/jtb.core.games.ui.bs.ads.module';
export {
  JTBCoreGamesUIBSBackdropModule,
  BootstrapBackdropService,
  JTBModalBackdrop
} from './backdrop/jtb.core.games.ui.bs.backdrop.module';
export {
  JTBCoreGamesUIBSErrorsModule,
  BootstrapErrorListenerService,
  DefaultErrorComponent
} from './errors/jtb.core.games.ui.bs.errors.module';
export {JTBCoreGamesUIBInviteModule, InviteComponent} from './invite/jtb.core.games.ui.bs.invite.module';
export {JTBCoreGamesUIBSSignInModule, SignInComponent} from './sign-in/jtb.core.games.ui.bs.sign-in.module';
export {JTBCoreGamesUIBSSignedInModule, SignedInComponent} from './signed-in/jtb.core.games.ui.bs.signed-in.module';
export {
  JTBCoreGamesUIBSVersionNotesModule,
  DefaultVersionNotesComponent,
  VersionService
} from './version-notes/jtb.core.games.ui.bs.version-notes.module';

@NgModule({
  imports: [
    JTBCoreGamesUI,
    JTBCoreGamesUIBSAdminModule,
    JTBCoreGamesUIBSSignInModule,
    JTBCoreGamesUIBSSignedInModule,
    JTBCoreGamesUIBSActionsModule,
    JTBCoreGamesUIBSVersionNotesModule,
    JTBCoreGamesUIBSAdsModule,
    JTBCoreGamesUIBSBackdropModule,
    JTBCoreGamesUIBSErrorsModule,
    JTBCoreGamesUIBInviteModule
  ],
  exports: [
    JTBCoreGamesUI,
    JTBCoreGamesUIBSAdminModule,
    JTBCoreGamesUIBSSignInModule,
    JTBCoreGamesUIBSSignedInModule,
    JTBCoreGamesUIBSActionsModule,
    JTBCoreGamesUIBSVersionNotesModule,
    JTBCoreGamesUIBSAdsModule,
    JTBCoreGamesUIBSBackdropModule,
    JTBCoreGamesUIBSErrorsModule,
    JTBCoreGamesUIBInviteModule
  ]
})
export class JTBCoreGamesUIBootstrap {
}
