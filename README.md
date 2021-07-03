# int-offer-pluginInstrukcja obsługi
0. Demo formularza http://labs.bpcoders.pl/oferta-internet/ - nie spamować, mam podpięty swój email
1. zainstalować plugin contact form 7
2. W miejscu gdzie ma wyświetlać się formularz wpisać shortcode [bpc_offer id="8"] gdzie ID ma być id formularza
3. Ostylowanie formularza należy zrobić samemu pod dany wygląd strony - to samo tyczy się całego skryptu, jest to plugin więc może być użyty na wielu stronach o różnym designie.
Kod formularza contact form zawierający odpowiednie dane
   <label> Twoje imię
   [text* your-name] </label>

<label> Twój email
    [email* your-email] </label>

<label> Temat
    [text* your-subject] </label>

<label> Twoja wiadomości (opcja)
    [textarea your-message] </label>
<br>
<div class="hidden-fields">
[text city id:city-form readonly]
[text street id:street-form readonly]
[text number id:number-form readonly]
[text internet id:internet readonly]
[text oferty id:oferty readonly]
[text tv id:tv readonly]
</div>
[submit "Wyślij"]

Kod emaila

Nadawca: [your-name] <[your-email]>
Temat: [your-subject]

Treść wiadomości:
[your-message]

Informacje dotyczące usługi:
Miasto: [city]
Ulica: [street]
Numer: [number]
Internet: [internet]
Telewizja: [tv]
Dodatkowe oferty [oferty]
--
Ta wiadomość została wysłana przez formularz kontaktowy na stronie [_site_title] ([_site_url]).ysłana przez formularz kontaktowy na stronie [_site_title] ([_site_url]).