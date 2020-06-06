

<div class="parent_settings">
    <div class="showSettings">
        <button class="button action"> <?php _e('show settings','wrm') ?></button>
    </div>

    <div class="settingsOverlay">
        <div class="settings">
            <form action="option.php" type="POST">
                <h2> Woocommerce return manager <?php _e('settings','wrm') ?></h2>
                <div class="field">
                    <label for="pdf_img">
                        <?php _e('Your image for the note of the PDF','wrm') ?>
                        <a href="https://www.base64-image.de/">
                            (<?php _e('Base64 format is needed','wrm') ?>)
                        </a>
                    </label>
                    <input id="pdf_img" type="text">
                </div>

                <div class="field">

                    <label for="enable_recaptcha">
                        <?php _e('Do you want google recaptcha') ?>?
                    </label>
                    <input type="checkbox" >

                    <div class="enabledRecaptcha">
                        <label for="google_recapcha">
                            <?php _e('If you want recapcha on field fill','wrm') ?>
                            <a href="https://www.google.com/recaptcha/intro/v3.html">
                                (<?php _e('Find your api key','wrm') ?>)
                            </a>
                        </label>
                        <input type="text" >
                    </div>

                </div>


            </form>
        </div>
    </div>


</div>

