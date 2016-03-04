//Listen for changes to anything marked as a formula input

$(document).ready(function(){
    $(".formulainput").keyup(function(){
        var vals = getVals();
        var ingame = isNaN(inGameDps(vals).toFixed(2)) ? '*' :inGameDps(vals).toFixed(2) ;
        var actualhs = isNaN(actualHsChanceDps(vals).toFixed(2)) ? '*' : actualHsChanceDps(vals).toFixed(2);
        var burst = isNaN(burstDps(vals).toFixed(2)) ? '*' : burstDps(vals).toFixed(2);

        $("#ingamedpsoutput").text(commafy(ingame));
        $("#actualhschancedpsoutput").text(commafy(actualhs));
        $("#burstdpsoutput").text(commafy(burst));
    });
   /* $("#calcbulletdmgbtn").click(function(){
        //update button
        $("#calcbulletdmgbtn").addClass('btn-warning');
        $("#calcbulletdmgbtn").removeClass('btn-default');
        $("#enterbulletdmgbtn").removeClass('btn-warning');
        $("#enterbulletdmgbtn").addClass('btn-default');

        $("#perbulletdmg").prop('disabled', true);
        $("#weaponbasedmg").prop('disabled', false);
        $("#firearmsbuff").prop('disabled', false);
        $("#magazinedmg").prop('disabled', false);
        $("#glovesdmg").prop('disabled', false);
    });

    $("#enterbulletdmgbtn").click(function(){

        //update button
        $("#enterbulletdmgbtn").addClass('btn-warning');
        $("#enterbulletdmgbtn").removeClass('btn-default');
        $("#calcbulletdmgbtn").removeClass('btn-warning');
        $("#calcbulletdmgbtn").addClass('btn-default');

        $("#perbulletdmg").prop('disabled', false);
        $("#weaponbasedmg").prop('disabled', true);
        $("#firearmsbuff").prop('disabled', true);
        $("#magazinedmg").prop('disabled', true);
        $("#glovesdmg").prop('disabled', true);
    });
    */
});


var getVals = function(){
    var vals = {};
    //get the values from the inputs
    vals.weaponbasedmg = Number($("#weaponbasedmg").val());
    vals.firearmsbuff = Number($("#firearmsbuff").val() * 0.01);
    vals.magazinedmg = Number($("#magazinedmg").val() * 0.01);
    vals.glovesdmg = Number($("#glovesdmg").val());
    vals.perbulletdmg = Number($("#perbulletdmg").val());
    vals.critchance = Number($("#critchance").val() * 0.01);
    vals.critdmg = Number($("#critdmg").val() * 0.01);
    vals.accuracy = Number($("#accuracy").val() * 0.001);
    vals.headshotbonusdmg = Number($("#headshotbonusdmg").val() * 0.01);
    vals.rpm = Number($("#rpm").val());
    vals.reloadtime = Number($("#reloadtime").val());
    vals.magazinesize = Number($("#magazinesize").val());
    vals.likelyheadshotchance = Number($("#likelyheadshotchance").val() * 0.01);

    vals.weaponbasedmg = vals.weaponbasedmg/vals.firearmsbuff;
    var perbulletcalculated = (vals.firearmsbuff * vals.weaponbasedmg) + (vals.weaponbasedmg * vals.magazinedmg) + vals.glovesdmg;

    if($("#perbulletdmg").is(":disabled")){
        vals.perbulletdmg = perbulletcalculated;
        $("#perbulletdmg").val(perbulletcalculated);
    }

    return vals;
};

var commafy = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var inGameDps = function(vals){
    //(Per bullet dmg + (crit chance  * crit dmg bonus) + (accuracy * hs dmg bonus) + (crit chance * crit dmg bonus * accuracy * hs dmg bonus))
    // ALL THAT TIMES MAG SIZE
    //ALL THAT divided by (Mag size/(rpm/60)+reload time)

    var crits = (vals.critchance * vals.critdmg);
    var hsbonus = (vals.perbulletdmg * vals.accuracy * vals.headshotbonusdmg);
    var hscrit =  (vals.critchance * vals.critdmg * vals.accuracy * vals.headshotbonusdmg);

    var numerator = (vals.perbulletdmg + crits + hsbonus + hscrit) * vals.magazinesize;

    var denominator = (vals.magazinesize/(vals.rpm/60) + vals.reloadtime);

    return numerator / denominator;
};

var actualHsChanceDps = function(vals){
    var crits = (vals.critchance * vals.critdmg);
    var hsbonus = (vals.perbulletdmg * vals.likelyheadshotchance * vals.headshotbonusdmg);
    var hscrit =  (vals.critchance * vals.critdmg * vals.likelyheadshotchance * vals.headshotbonusdmg);

    var numerator = (vals.perbulletdmg + crits + hsbonus + hscrit) * vals.magazinesize;

    var denominator = (vals.magazinesize/(vals.rpm/60) + vals.reloadtime);

    return numerator / denominator;
};

var burstDps = function(vals){

    var perbulletdmg = vals.perbulletdmg;
    var crits = vals.critchance * vals.critdmg;
    var hsbonus = perbulletdmg * vals.likelyheadshotchance * vals.headshotbonusdmg;
    var hscrit = crits * vals.likelyheadshotchance * vals.headshotbonusdmg;

    var numerator = (perbulletdmg + crits + hsbonus + hscrit);

    var denominator = vals.magazinesize / vals.magazinesize/(vals.rpm/60);

    return numerator/denominator;
};
