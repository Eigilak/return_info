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
    register_setting( 'wrm', 'wrm_options' );

    // register a new section in the "wrm" page
    add_settings_section(
        'wrm_section_developers',
        '',
        'wrm_section_developers_cb',
        'wrm'
    );

    // register a new field in the "wrm_section_developers" section, inside the "wrm" page
    add_settings_field(
        'wrm_field_pill', // as of WP 4.6 this value is used only internally
        // use $args' label_for to populate the id inside the callback
        __( 'Pill', 'wrm' ),
        'wrm_field_pill_cb',
        'wrm',
        'wrm_section_developers',
        [
            'label_for' => 'wrm_field_pill',
            'class' => 'wrm_row',
            'wrm_custom_data' => 'custom',
        ]
    );
}

/**
 * register our wrm_settings_init to the admin_init action hook
 */
add_action( 'admin_init', 'wrm_settings_init' );

/**
 * custom option and settings:
 * callback functions
 */

// developers section cb

// section callbacks can accept an $args parameter, which is an array.
// $args have the following keys defined: title, id, callback.
// the values are defined at the add_settings_section() function.
function wrm_section_developers_cb( $args ) {
    ?>
    <p id="<?php echo esc_attr( $args['id'] ); ?>"><?php esc_html_e( 'Follow the white rabbit.', 'wrm' ); ?></p>
    <?php
}

function wrm_field_pill_cb( $args ) {
    // get the value of the setting we've registered with register_setting()
    $options = get_option( 'wrm_options' );
    // output the field
    ?>



    <select id="<?php echo esc_attr( $args['label_for'] ); ?>"
            data-custom="<?php echo esc_attr( $args['wrm_custom_data'] ); ?>"
            name="wrm_options[<?php echo esc_attr( $args['label_for'] ); ?>]"
    >
        <option value="red" <?php echo isset( $options[ $args['label_for'] ] ) ? ( selected( $options[ $args['label_for'] ], 'red', false ) ) : ( '' ); ?>>
            <?php esc_html_e( 'red pill', 'wrm' ); ?>
        </option>
        <option value="blue" <?php echo isset( $options[ $args['label_for'] ] ) ? ( selected( $options[ $args['label_for'] ], 'blue', false ) ) : ( '' ); ?>>
            <?php esc_html_e( 'blue pill', 'wrm' ); ?>
        </option>
    </select>

    <?php
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
    <div class="wrap">
        <form action="options.php" method="post">
            <?php
            // output security fields for the registered setting "wrm"
            settings_fields( 'wrm' );
            // output setting sections and their fields
            // (sections are registered for "wrm", each field is registered to a specific section)
            do_settings_sections( 'wrm' );
            // output save settings button
            submit_button( 'Save Settings' );
            ?>
        </form>
    </div>
    <?php
}
