<?php
/**
 * @internal never define functions inside callbacks.
 * these functions could be run multiple times; this would result in a fatal error.
 */

/**
 * custom option and settings
 */
function wrm_settings_init() {
    // register a new setting for "wrm" page
    register_setting( 'wrm', 'wrm_options_base64' );
    register_setting( 'wrm', 'wrm_options_recaptcha' );
    register_setting( 'wrm', 'wrm_options_enable_recaptcha' );
    register_setting( 'wrm', 'wrm_options_attribute1' );
    register_setting( 'wrm', 'wrm_options_attribute2' );
    register_setting( 'wrm', 'wrm_options_shipmondo' );
    register_setting('wrm','wrm_options_free_return_period');
    register_setting('wrm','wrm_options_claim_period');

}

/**
 * register our wrm_settings_init to the admin_init action hook
 */
add_action( 'admin_init', 'wrm_settings_init' );

function get_option_wrm($option_name){

}


function print_option_wrm($option_name){
    echo esc_attr( get_option($option_name) );
}


function wrm_section_developers_cb( $args ) {

}

function wrm_field_pill_cb( $args ) {
    // get the value of the setting we've registered with register_setting()
    $options = get_option( 'wrm_options' );
    // output the field
}


/**
 * top level menu:
 * callback functions
 */
function wrm_options_page_html() {
    // check user capabilities
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    // add error/update messages

    // check if the user have submitted the settings
    // wordpress will add the "settings-updated" $_GET parameter to the url
    if ( isset( $_GET['settings-updated'] ) ) {
        // add settings saved message with the class of "updated"
        add_settings_error( 'wrm_messages', 'wrm_message', __( 'Settings Saved', 'wrm' ), 'updated' );
    }


    settings_errors( 'wrm_messages' );
    ?>
    <div class="wrm_settings">
        <form action="options.php" method="post">
            <?php
            // output security fields for the registered setting "wrm"
            settings_fields( 'wrm' );
            do_settings_sections( 'wrm' );
            ?>
            <div class="showSettings">
                <div class="button action" @click="[ show_settings  ? show_settings=false : show_settings=true ]">
                    <span v-if="show_settings"> <?php _e('Hide settings','wrm')?></span>
                    <span v-if="!show_settings"> <?php _e('Show settings','wrm')?></span>

                </div>
            </div>


            <div class="innerform" v-if="show_settings">

                <h2> Woocommerce return manager <?php _e('settings','wrm') ?></h2>

                <div class="field">
                    <label for="pdf_img">
                        <?php _e('Your image for the note of the PDF','wrm') ?>
                        <a  target="_blank" href="https://www.base64-image.de/">
                            (<?php _e('Base64 format is needed','wrm') ?>)
                        </a>
                    </label>
                    <input id="pdf_img" name="wrm_options_base64" value="<?php print_option_wrm('wrm_options_base64');  ?>" type="text">
                </div>

                <div class="field">
                    <div class="enabledRecaptcha">
                        <label for="recapatcha">
                            <?php _e('Enable Google recaptcha','wrm') ?>
                            <a target="_blank" href="https://www.google.com/recaptcha/intro/v3.html">
                                (<?php _e('Find your api key','wrm') ?>)
                            </a>
                        </label>
                        <input id="recapatcha" type="checkbox" name="wrm_options_enable_recaptcha" value="<?php print_option_wrm('wrm_options_enable_recaptcha'); ?> "  >
                    </div>
                </div>

                <div class="field" >
                    <div class="enabledRecaptcha">
                        <label for="recapatcha">
                            <?php _e('If you want recapcha on field fill','wrm') ?>
                            <a target="_blank" href="https://www.google.com/recaptcha/intro/v3.html">
                                (<?php _e('Find your api key','wrm') ?>)
                            </a>
                        </label>
                        <input id="recapatcha" type="text" name="wrm_options_recaptcha" value="<?php print_option_wrm('wrm_options_recaptcha'); ?> "  >
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
                        <input type="text" name="wrm_options_attribute1" placeholder="<?php _e('attribute','wrm') ?>1" value="<?php print_option_wrm('wrm_options_attribute1'); ?>" >
                        <input type="text" name="wrm_options_attribute2" placeholder="<?php _e('attribute','wrm') ?>2" value="<?php print_option_wrm('wrm_options_attribute2'); ?>"  >
                    </div>
                </div>

                <div class="field shipmondo_name">
                    <label for="shipmondo_name"> Shipmondo <?php _e('name','wrm') ?>
                    </label>
                    <div class="shipmondo_name">
                        <input type="text" name="wrm_options_shipmondo" value="<?php print_option_wrm('wrm_options_shipmondo'); ?>">
                    </div>
                </div>
                <div class="field shipmondo_name">
                    <label for="shipmondo_name">  <?php _e('Full return periode','wrm'); echo '('; _e('days'); echo ')' ?>
                    </label>
                    <div class="shipmondo_name">
                        <input type="number" name="wrm_options_free_return_period" value="<?php print_option_wrm('wrm_options_free_return_period'); ?>">
                    </div>
                </div>
                <div class="field shipmondo_name">
                    <label for="shipmondo_name">  <?php _e('Claim return periode','wrm'); echo '('; _e('years'); echo ')' ?>
                    </label>
                    <div class="shipmondo_name">
                        <input type="number" name="wrm_options_claim_period" value="<?php print_option_wrm('wrm_options_claim_period'); ?>">
                    </div>
                </div>

                <?php
                // output save settings button
                submit_button( __('Save settings','wrm') );
                ?>

            </div>
        </form>
    </div>
    <?php
}
