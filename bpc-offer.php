<?php
/**
 * @package BPC_offer
 * @version 0.1
 */
/*
Plugin Name: Internet offer
Plugin URI: http://bpcoders.pl
Description: Plugin for choosing address for checking internet offer
Author: Krystian Kuźmiński
Version: 0.1
Author URI: http://bpcoders.pl
*/

add_action('wp_enqueue_scripts', 'slick_register_styles');
function slick_register_styles()
{
    wp_enqueue_style('slick-css', plugins_url('bpc-offer/css/slick.min.css'), [], false, 'all');
    wp_enqueue_style('slick-theme-css', plugins_url('bpc-offer/css/slick-theme.css'), ['slick-css'], false, 'all');
    wp_enqueue_script('carousel-js', plugins_url('bpc-offer/js/slick.min.js'), ['jquery'], '1.0.0', true);
}

function bpc_offer_css()
{
    $plugin_url = plugin_dir_url(__FILE__);
    wp_enqueue_style('style', $plugin_url . 'css/style.css');
}

add_action('wp_enqueue_scripts', 'bpc_offer_css');

function bpc_offer_shortcode($atts)
{
    $atts = shortcode_atts(
        array(
            'id' => '1',
        ), $atts, 'bpc_offer');
    return '
    <div class="special-offer">
      <div class="special-offer__form">
        <div class="city__wrapper">
        <div class="section-title">
          <span>wybierz miejscowość</span>
          </div>
          <input id="input-city" name="input-city" list="city">
          <datalist id="city"></datalist>
        </div>

        <div class="streets__wrapper">
        <div class="section-title">
        <span>wybierz ulicę</span>
        </div>
          <input id="input-streets" name="input-streets" list="streets">
          <datalist id="streets"></datalist>
        </div>
        <div class="numbers__wrapper">
        <div class="section-title">
        <span>wybierz numer</span>
        </div>
          <select name="numbers" id="numbers" class="numbers" onchange="check_data(this)">
            <option disabled selected value></option>
          </select>
        </div>
        <div class="special-offer__form-footer">
          <button id="bpc-reset" type="button">Zresetuj wybór</button>
        </div>
      </div>
        <div class="summary" style="display: none;">
        <div class="section-title">
        <span>wybierz prędkość internetu</span>
        </div>
      <div class="internet-slider">
      </div>
      <div class="section-title">
      <span>wybierz pakiet kanałów TV</span>
      </div>
      <div class="tv-slider">
      <div class="single-slide">
      <h2 class="single-slide__title">Telewizja </h2>
      <h3 class="single-slide__subtitle">Nie chcę telewizji 😢</h3>
      <h3 class="single-slide__price"><span class="tv-price">0</span> PLN</h3>
  </div>
        </div>
        
        <div class="section-title">
        <span>Wybierz pakiety tematyczne</span>
        </div>
        <div class="additionals-offer"></div>

        <div class="total">
            <h3>Wysokość abonamentu</h3>
            <div class="total__price-wrapper">
            <span class="total__price"></span>zł
            </div>
        </div>
      <div class="special-offer__last-step" style="display: none;">
       ' . do_shortcode('[contact-form-7 id="' . $atts['id'] . '"]') . '
      </div>
        
        </div>
    </div>';
}

add_shortcode('bpc_offer', 'bpc_offer_shortcode');

function bpc_offer_js()
{
    wp_register_script('script-with-dependency', plugins_url('bpc-offer/js/script.js'), array('jquery'), '1.0.0', true);
    wp_enqueue_script('script-with-dependency');
}

add_action('wp_enqueue_scripts', 'bpc_offer_js');
