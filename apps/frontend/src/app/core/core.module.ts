import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrimeNGModule } from "../primeng.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    // declarations: [AppTopBarComponent],
    imports: [CommonModule, SharedModule],
    // exports: [AppTopBarComponent],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() core: CoreModule) {
        if (core) {
            throw new Error(
                "You should import core module only in the root module"
            );
        }
    }
}
