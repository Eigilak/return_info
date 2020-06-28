

<div class="parent_settings" unselectable="on">
    <div class="showSettings">
        <button class="button action" @click="[ show_settings  ? show_settings=false : show_settings=true ]">
            <span v-if="show_settings"> <?php _e('show settings','wrm')?></span>
            <span v-if="!show_settings"> <?php _e('hide settings','wrm')?></span>

        </button>
    </div>

    <div class="settingsOverlay">
        <div class="settings">
            <form @submit.prevent="submit_settings" >
                <h2> Woocommerce return manager <?php _e('settings','wrm') ?></h2>

                <div class="field">
                    <label for="pdf_img">
                        <?php _e('Your image for the note of the PDF','wrm') ?>
                        <a  target="_blank" href="https://www.base64-image.de/">
                            (<?php _e('Base64 format is needed','wrm') ?>)
                        </a>
                    </label>
                    <input id="pdf_img" v-model="settings_Form.pdf_img" type="text">
                </div>

                <div class="field">
                    <label for="enable_recaptcha">
                        <?php _e('Do you want google recaptcha') ?>?
                    </label>
                    <input type="checkbox" v-model="settings_Form.is_recaptcha_enabled">
                    <div class="enabledRecaptcha">
                        <label for="google_recapcha">
                            <?php _e('If you want recapcha on field fill','wrm') ?>
                            <a target="_blank" href="https://www.google.com/recaptcha/intro/v3.html">
                                (<?php _e('Find your api key','wrm') ?>)
                            </a>
                        </label>
                        <input type="text" v-model="settings_Form.recaptcha" >
                    </div>
                </div>

                <div class="field">
                    <label for="attribute_terms">
                        <?php _e('Product attribute_terms') ?>

                    </label><strong class="findGif">
                        ( <?php _e('where do i find that?') ?> )
                    </strong>
                    <div class="findGif">
                        <img src="" alt="">
                    </div>

                    <div class="attribute_terms">
                        <input id="attribute_terms" type="text" placeholder="<?php _e('attribute') ?> 1" v-model="settings_Form.attribute1" >
                        <input type="text" placeholder="<?php _e('attribute')?> 2" v-model="settings_Form.attribute2" >
                    </div>
                </div>

                <div class="field">
                    <label for="use_shipmondo">
                        <?php _e('Use shipmondo?','wrm') ?>
                    </label>
                    <div class="use_shipmondo">
                        <input id="use_shipmondo" type="checkbox">
                    </div>

                </div>

                <div class="field shipmondo_name">
                    <label for="shipmondo_name"> Shipmondo <?php _e('name','wrm') ?>
                    </label>
                    <div class="shipmondo_name">
                        <input id="use_shipmondo" type="text">
                    </div>

                </div>
            </form>
        </div>
    </div>


</div>

