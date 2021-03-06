 /* 
 * Copyright (C) 2013-2014 Bitergia
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
 *
 * This file is a part of the VizGrimoireJS package
 *
 * Authors:
 *   Alvaro del Castillo San Felix <acs@bitergia.com>
 */

var Convert = {};

(function() {

// TODO: share logic between three periods duration
Convert.convertMicrodashText = function () {
    /* composes the HTML for trends with number about diff and percentages*/
    var divs = $(".MicrodashText");
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            var metric = $(this).data('metric');
            var show_name = $(this).data('name');
            var ds = Report.getMetricDS(metric)[0];
            if (ds === undefined) return;
            var total = ds.getGlobalData()[metric];
            var html = '<div class="row-fluid">';

            if(show_name){ //if name is shown we'll have four columns
                html += '<div class="span3">';
                html += '<span class="dayschange">' + ds.basic_metrics[metric].name + '</span>';
                html += '</div>';
            }

            // $.each({7:'week',30:'month',365:'year'}, function(period, name) {
            $.each([365,30,7], function(index, period) {
                var column = ds.getMetrics()[metric].column;
                // value -> items for this period
                // netvalue -> change with previous period
                // percentagevalue -> % changed with previous
                var value = ds.getGlobalData()[metric+"_"+period];
                var netvalue = ds.getGlobalData()["diff_net"+column+"_"+period];
                var percentagevalue = ds.getGlobalData()["percentage_"+column+"_"+period];
                percentagevalue = Math.round(percentagevalue*10)/10;  // round "original" to 1 decimal
                if (value === undefined) return;
                var str_percentagevalue = '';
                if (netvalue > 0) str_percentagevalue = '+' + percentagevalue;
                if (netvalue < 0) str_percentagevalue = '-' + Math.abs(percentagevalue);

                if(show_name){
                    html += '<div class="span3">';
                }else{
                    html += '<div class="span4">';
                }

                html += '<span class="dayschange">Last '+period+' days:</span>';
                html += ' '+Report.formatValue(value) + '<br>';
                if (netvalue === 0) {
                    html += '<i class="fa fa-arrow-circle-right"></i> <span class="zeropercent">&nbsp;'+str_percentagevalue+'%</span>&nbsp;';
                } else if (netvalue > 0) {
                    html += '<i class="fa fa-arrow-circle-up"></i> <span class="pospercent">&nbsp;'+str_percentagevalue+'%</span>&nbsp;';
                } else if (netvalue < 0) {
                    html += '<i class="fa fa-arrow-circle-down"></i> <span class="negpercent">&nbsp;'+str_percentagevalue+'%</span>&nbsp;';
                }
                html += '</div><!--span4-->';
            });

            html += '</div><!--row-fluid-->';
            $(div).append(html);
        });
    }
};

Convert.convertMicrodash = function () {
    var divs = $(".Microdash");
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            var metric = $(this).data('metric');
            // Microdash text or graphical
            var text = $(this).data('text');
            var ds = Report.getMetricDS(metric)[0];
            var total = ds.getGlobalData()[metric];
            var html = '<div>';
            html += '<div style="float:left">';
            html += '<span class="medium-fp-number">'+Report.formatValue(total);
            html += '</span> '+ds.getMetrics()[metric].name;
            html += '</div>';
            html += '<div id="Microdash" '+
                    'class="MetricsEvol" data-data-source="'+ds.getName()+'" data-metrics="'+
                    metric+'" data-min=true style="margin-left:10px; float:left;width:100px; height:25px;"></div>';
            html += '<div style="clear:both"></div><div>';
            // $.each({7:'week',30:'month',365:'year'}, function(period, name) {
            $.each([365,30,7], function(index, period) {
                var column = ds.getMetrics()[metric].column;
                var netvalue = ds.getGlobalData()["diff_net"+column+"_"+period];
                var percentagevalue = ds.getGlobalData()["percentage_"+column+"_"+period];
                var value = ds.getGlobalData()[metric+"_"+period];
                if (value === undefined) return;
                html += "<span class='dayschange'>"+period+" Days Change</span>:"+Report.formatValue(value)+"&nbsp;";
                if (netvalue === 0) {
                    html += '';
                }
                else if (netvalue > 0) {
                    html += '<i class="icon-circle-arrow-up"></i>';
                    html += '<small>(+'+percentagevalue+'%)</small>&nbsp;';
                } else if (netvalue < 0) {
                    html += '<i class="icon-circle-arrow-down"></i>';
                    html += '<small>(-'+Math.abs(percentagevalue)+'%)</small>&nbsp;';
                }
            });
            html += '</div>';
            html += '<div>';
            $(div).append(html);
        });
    }
};

Convert.convertNavbar = function() {
    $.get(Report.getHtmlDir()+"navbar.html", function(navigation) {
        $("#Navbar").html(navigation);
        displayReportData();
        Report.displayActiveMenu();
        var addURL = Report.addDataDir(); 
        if (addURL) {
            var $links = $("#Navbar a");
            $.each($links, function(index, value){
                if (value.href.indexOf("data_dir")!==-1) return;
                value.href += "?"+addURL;
            });
        }
    });
};

Convert.convertFooter = function() {
    $.get(Report.getHtmlDir()+"footer.html", function(footer) {
        $("#Footer").html(footer);
        $("#vizjs-lib-version").append(vizjslib_git_tag);
    });
};

Convert.convertSummary = function() {
    div_param = "Summary";
    var divs = $("." + div_param);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            var ds = $(this).data('data-source');
            var DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            div.id = ds+'-Summary';
            DS.displayGlobalSummary(div.id);
        });
    }
};

function displayReportData() {
    data = Report.getProjectData();
    document.title = data.project_name + ' Report by Bitergia';
    if (data.title) document.title = data.title;
    $(".report_date").text(data.date);
    $(".report_name").text(data.project_name);
    str = data.blog_url;
    if (str && str.length > 0) {
        $('#blogEntry').html(
                "<br><a href='" + str +
                "'>Blog post with some more details</a>");
        $('.blog_url').attr("href", data.blog_url);
    } else {
        $('#more_info').hide();
    }
    str = data.producer;
    if (str && str.length > 0) {
        $('#producer').html(str);
    } else {
        $('#producer').html("<a href='http://bitergia.com'>Bitergia</a>");
    }
    $(".project_name").text(data.project_name);
    $("#project_url").attr("href", data.project_url);
}


Convert.convertRefcard = function() {
    /* Deprecated function. See convertDSTable*/
    $.when($.get(Report.getHtmlDir()+"refcard.html"),
            $.get(Report.getHtmlDir()+"project-card.html"))
    .done (function(res1, res2) {
        refcard = res1[0];
        projcard = res2[0];

        $("#Refcard").html(refcard);
        displayReportData();
        $.each(Report.getProjectsData(), function(prj_name, prj_data) {
            var new_div = "card-"+prj_name.replace(".","").replace(" ","");
            $("#Refcard #projects_info").append(projcard);
            $("#Refcard #projects_info #new_card")
                .attr("id", new_div);
            $.each(Report.getDataSources(), function(i, DS) {
                if (DS.getProject() !== prj_name) {
                    $("#" + new_div + ' .'+DS.getName()+'-info').hide();
                    return;
                }
                DS.displayData(new_div);
            });
            $("#"+new_div+" #project_name").text(prj_name);
            if (Report.getProjectsDirs.length>1)
                $("#"+new_div+" .project_info")
                    .append(' <a href="VizGrimoireJS/browser/index.html?data_dir=../../'+prj_data.dir+'">Report</a>');
            $("#"+new_div+" #project_url")
                .attr("href", prj_data.url);
        });
    });
};

Convert.convertGlobalData = function (){
    var divs = $(".GlobalData");
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            var data = DS.getGlobalData();
            var key = $(this).data('field');
            $(this).text(Report.formatValue(data[key], key));
        });
    }
};

Convert.convertProjectData = function (){
    var divs = $(".ProjectData");
    var p = Report.getParameterByName("project");
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            var data = DS.getProjectsGlobalData()[p];
            var key = $(this).data('field');
            $(this).text(Report.formatValue(data[key], key));
        });
    }
};

Convert.convertRadarActivity = function() {
    var div_param = "RadarActivity";
    var divs = $("#" + div_param);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
        });
        //  TODO: In which div is displayed?
        Viz.displayRadarActivity(div_param);
    }
};

Convert.convertRadarCommunity = function() {
    var div_param = "RadarCommunity";
    var divs = $("#" + div_param);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
        });
        //  TODO: In which div is displayed?
        Viz.displayRadarCommunity('RadarCommunity');
    }
};

Convert.convertTreemap = function() {
    var div_param = "Treemap";
    var divs = $("#" + div_param);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
        });
        //  TODO: Just one treemap supported
        var file = $('#Treemap').data('file');
        $('#Treemap').empty();
        Viz.displayTreeMap('Treemap', file);
    }
};

Convert.convertBubbles = function() {
    div_param = "Bubbles";
    var divs = $("." + div_param);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            var ds = $(this).data('data-source');
            var DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (DS.getData().length === 0) return;
            var radius = $(this).data('radius');
            div.id = ds + "-Bubbles";
            DS.displayBubbles(div.id, radius);
        });
    }
};


function loadHTMLEvolParameters(htmldiv, config_viz){
    /*var metrics = $(htmldiv).data('metrics');
    var ds = $(htmldiv).data('data-source');
    var DS = Report.getDataSourceByName(ds);
    if (DS === null) return;*/
    config_viz.help = true;
    var help = $(htmldiv).data('help');
    if (help !== undefined) config_viz.help = help;
    config_viz.show_legend = false;
    if ($(htmldiv).data('frame-time'))
        config_viz.frame_time = true;
    config_viz.graph = $(htmldiv).data('graph');
    if ($(htmldiv).data('min')) {
        config_viz.show_legend = false;
        config_viz.show_labels = true;
        config_viz.show_grid = true;
        // config_viz.show_mouse = false;
        config_viz.help = false;
    }
    if ($(htmldiv).data('legend'))
        config_viz.show_legend = true;
    config_viz.ligth_style = false;
    if ($(htmldiv).data('light-style')){
        config_viz.light_style = true;
    }
    if ($(htmldiv).data('custom-title')){
        config_viz.custom_title = $(htmldiv).data('custom-title');
    }
    if (config_viz.help && $(htmldiv).data('custom-help')){
        config_viz.custom_help = $(htmldiv).data('custom-help');
    } else {
        config_viz.custom_help = "";
    }
    // In unixtime
    var start = $(htmldiv).data('start');
    if (start) config_viz.start_time = start;
    var end = $(htmldiv).data('end');
    if (end) config_viz.end_time = end;
    
    var remove_last_point = $(htmldiv).data('remove-last-point');
    if (remove_last_point) config_viz.remove_last_point = true;    

    return config_viz;    
}

Convert.convertMetricsEvol = function() {
    // General config for metrics viz
    var config_metric = {};

    config_metric.show_desc = false;
    config_metric.show_title = true;
    config_metric.show_labels = true;

    var config = Report.getVizConfig();
    if (config) {
        $.each(config, function(key, value) {
            config_metric[key] = value;
        });
    }

    var div_param = "MetricsEvol";
    var divs = $("." + div_param);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            var config_viz = {};
            $.each(config_metric, function(key, value) {
                config_viz[key] = value;
            });
            $(this).empty();
            var metrics = $(this).data('metrics');
            var ds = $(this).data('data-source');
            var DS = Report.getDataSourceByName(ds);
            if (DS === null) return;

            config_viz = loadHTMLEvolParameters(div, config_viz);

            div.id = metrics.replace(/,/g,"-")+"-"+ds+"-metrics-evol-"+this.id;
            div.id = div.id.replace(/\n|\s/g, "");
            DS.displayMetricsEvol(metrics.split(","),div.id,
                    config_viz, $(this).data('convert'));
        });
    }
};

Convert.convertMetricsEvolSet = function() {
    div_param = "MetricsEvolSet";
    var divs = $("." + div_param);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            var all = $(this).data('all');
            var relative = $(this).data('relative');
            var summary_graph = $(this).data('summary-graph');
            var legend = $(this).data('legend-show');
            div.id = ds+"-MetricsEvolSet-"+this.id;
            if (all === true) {
                div.id = ds+"-All";
                Viz.displayEnvisionAll(div.id, relative, legend, summary_graph);
                return false;
            }
            var ds = $(this).data('data-source');
            var DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            DS.displayEnvision(div.id, relative, legend, summary_graph); 
        });
    }
};


Convert.convertTimeTo = function() {
    var div_tt = "TimeTo";
    divs = $("."+div_tt); 
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            var ds = $(this).data('data-source');
            var DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            var quantil = $(this).data('quantil');
            var type = $(this).data('type');
            div.id = ds+"-time-to-"+type+"-"+quantil;
            if (type === "fix")
                DS.displayTimeToFix(div.id, quantil);
            if (type === "attention")
                DS.displayTimeToAttention(div.id, quantil);
        });
    }
};

Convert.convertMarkovTable = function() {
    var div_id_mt = "MarkovTable";
    var divs = $("." + div_id_mt);
    var DS, ds;
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (DS.getData().length === 0) return;
            var title = $(this).data('title');
            div.id = ds + "-markov-table";
            DS.displayMarkovTable(div.id, title);
        });
    }
};


Convert.convertLastActivity = function() {
    var all_metrics = Report.getAllMetrics();
    function activityInfo(div, period, label) {
        var html = "<h4>Last "+ label + "</h4>";
        $.each(Report.getDataSources(), function(index, DS) {
            var data = DS.getGlobalData();
            $.each(data, function (key,val) {
                var suffix = "_"+period; 
                if (key.indexOf(suffix, key.length - suffix.length) !== -1) {
                    var metric = key.substring(0, key.length - suffix.length);
                    label = metric;
                    if (all_metrics[metric]) label = all_metrics[metric].name;
                    html += label + ":" + data[key] + "<br>";
                }
            });
        });
        $(div).append(html);
    }
    var divs = $(".LastActivity");
    var period = null;
    var days = {"Week":7,"Month":30,"Quarter":90,"Year":365};
    if (divs.length > 0)
        $.each(divs, function(id, div) {
            period = $(div).data('period');
            activityInfo(div, days[period], period);
        });
};

Convert.convertTop = function() {
    var div_id_top = "Top";
    var divs = $("." + div_id_top);
    var DS, ds;
    if (divs.length > 0) {
        var unique = 0;
        $.each(divs, function(id, div) {
            $(this).empty();
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (DS.getData().length === 0) return;
            var show_all = false;
            if ($(this).data('show_all')) show_all = true;
            var top_metric = $(this).data('metric');
            var limit = $(this).data('limit');
            var graph = $(this).data('graph');
            var people_links = $(this).data('people_links');
            var threads_links = $(this).data('threads_links');
            var period = $(this).data('period');
            var period_all = $(this).data('period_all');
            div.id = ds + "-" + div_id_top + (unique++);
            if (graph){
                div.id += "-"+graph;
            }
            if (period === undefined && period_all === undefined){
                period_all = true;
            }
            if (limit === undefined){
                limit = 10;
            }
            DS.displayTop(div.id, show_all, top_metric, period, period_all,
                          graph, limit, people_links, threads_links);
        });
    }
};

Convert.convertPersonMetrics = function (upeople_id, upeople_identifier) {
    var config_metric = {};
    config_metric.show_desc = false;
    config_metric.show_title = false;
    config_metric.show_labels = true;

    divs = $(".PersonMetrics");
    if (divs.length) {
        $.each(divs, function(id, div) {
            $(this).empty();
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            var metrics = $(this).data('metrics');
            config_metric.show_legend = false;
            if ($(this).data('legend')) config_metric.show_legend = true;
            if ($(this).data('person_id')) upeople_id = $(this).data('person_id');
            if ($(this).data('person_name')) upeople_identifier = $(this).data('person_name');
            div.id = metrics.replace(/,/g,"-")+"-people-metrics";
            DS.displayMetricsPeople(upeople_id, upeople_identifier, metrics.split(","),
                    div.id, config_metric);
        });
    }
};

function getRandomId() {
    return Math.floor(Math.random()*1000+1);
}

Convert.convertPersonData = function (upeople_id, upeople_identifier) {
    var divs = $(".PersonData"), name, email;
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            if ($(this).data('person_id')) upeople_id = $(this).data('person_id');
            if (!div.id) div.id = "PersonData" + "-" + upeople_id + "-" + getRandomId();
            var data = Report.getPeopleIdentities()[upeople_id];
            if (data) {
                name = DataProcess.selectPersonName(data);
                email = DataProcess.selectPersonEmail(data);
                email = "("+DataProcess.hideEmail(email)+")";
            } else {
                name = upeople_identifier;
                email = "";
            }
            $("#"+div.id).append("<h1><small>"+name + " "+ email + "</small></h1>");
        });
    }
};

Convert.convertPersonSummary = function (upeople_id, upeople_identifier) {
    var divs = $(".PersonSummary");
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if ($(this).data('person_id')) upeople_id = $(this).data('person_id');
            if ($(this).data('person_name')) upeople_identifier = $(this).data('person_name');
            div.id = ds+"-refcard-people";
            DS.displayPeopleSummary(div.id, upeople_id, upeople_identifier, DS);
        });
    }
};

Convert.convertPeople = function(upeople_id, upeople_identifier) {
    if (upeople_id === undefined)
        upeople_id = Report.getParameterByName("id");
    if (upeople_identifier === undefined)
        upeople_identifier = Report.getParameterByName("name");

    if (upeople_id === undefined) return;

    // Check we have all data
    if (Loader.check_people_item (upeople_id) === false) {
        $.each(Report.getDataSources(), function (index, DS)  {
            Loader.data_load_people_item (upeople_id, DS, Convert.convertPeople);
        });
        return;
    }

    Convert.convertPersonData(upeople_id, upeople_identifier);
    Convert.convertPersonSummary(upeople_id, upeople_identifier);
    Convert.convertPersonMetrics(upeople_id, upeople_identifier);

    Convert.activateHelp();
};

Convert.convertDemographics = function() {
    var divs = $(".Demographics");
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            // period in years
            var period = $(this).data('period');
            div.id = "Demographics"+"-"+ds+"-"+"-"+period;
            DS.displayDemographics(div.id, period);
        });
    }
};

function filterItemsConfig() {
    var config_metric = {};
    config_metric.show_desc = false;
    config_metric.show_title = false;
    config_metric.show_labels = true;
    config_metric.show_legend = false;
    return config_metric;
}

// Use mapping between repos for locating real item names
Convert.getRealItem = function(ds, filter, item) {
    var map = Report.getReposMap();

    // If repos map is not available returm item if exists in ds
    if (map === undefined || map.length === 0) {
        if ($.inArray(item, ds.getReposData())>-1) return item;
        else return null;
    }

    var map_item = null;
    if (filter === "repos") {
        var rdata = ds.getReposMetricsData()[item];
        if (rdata === undefined) {
            $.each(map, function(id, repos) {
                $.each(Report.getDataSources(), function(index, DS) {
                    if (repos[DS.getName()] === item) {
                        map_item = repos[ds.getName()];
                        return false;
                    }
                });
                if (map_item !== null) return false;
            });
            // if (map_item === null) map_item = item;
        }
        else map_item = item;
    }
    else map_item = item;

    return map_item;
};

Convert.convertFilterItemsSummary = function(filter) {
    var divlabel = "FilterItemsSummary";
    divs = $("."+divlabel);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (filter === undefined) filter = $(this).data('filter');
            if (filter !== $(this).data('filter')) return;            
            if (!filter) return;
            div.id = ds+"-"+divlabel;
            $(this).empty();
            if (filter === "repos")
                DS.displayReposSummary(div.id, DS);
            if (filter === "countries")
                DS.displayCountriesSummary(div.id, DS);
            if (filter === "companies")
                DS.displayCompaniesSummary(div.id, DS);
            if (filter === "domains")
                DS.displayDomainsSummary(div.id, DS);
            if (filter === "projects")
                DS.displayProjectsSummary(div.id, DS);
        });
    }
};

Convert.convertFilterItemsGlobal = function(filter) {
    var config_metric = filterItemsConfig();
    var divlabel = "FilterItemsGlobal";
    divs = $("."+divlabel);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (filter === undefined) filter = $(this).data('filter');
            if (filter !== $(this).data('filter')) return;
            if (!filter) return;
            var metric = $(this).data('metric');
            var show_others = $(this).data('show-others');
            var order_by = $(this).data('order-by');
            config_metric.show_legend = $(this).data('legend');
            if ($('#'+$(this).data('legend-div')).length>0) {
                config_metric.legend = {
                container: $(this).data('legend-div')};
            } else config_metric.legend = {container: null};
            config_metric.graph = $(this).data('graph');
            div.id = metric+"-"+divlabel;
            $(this).empty();
            if (filter === "repos")
                DS.displayMetricReposStatic(metric,div.id,
                    config_metric, order_by, show_others);
            if (filter === "countries")
                DS.displayMetricCountriesStatic(metric,div.id,
                    config_metric, order_by, show_others);
            if (filter === "companies")
                DS.displayMetricCompaniesStatic(metric,div.id,
                    config_metric, order_by, show_others);
            if (filter === "domains")
                DS.displayMetricDomainsStatic(metric,div.id,
                    config_metric, order_by, show_others);
            if (filter === "projects")
                DS.displayMetricProjectsStatic(metric,div.id,
                        config_metric, order_by, show_others);

        });
    }
};

Convert.convertFilterItemsNav = function(filter, page) {
    var divlabel = "FilterItemsNav";
    divs = $("."+divlabel);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (filter === undefined) filter = $(this).data('filter');
            if (filter !== $(this).data('filter')) return;
            if (!filter) return;
            if ($(this).data('page')) page = $(this).data('page');
            order_by = $(this).data('order-by');
            div.id = ds+"-"+divlabel;
            $(this).empty();
            if (filter === "repos")
                DS.displayItemsNav(div.id, filter, page, order_by);
            else if (filter === "countries")
                DS.displayItemsNav(div.id, filter, page);
            else if (filter === "companies")
                DS.displayItemsNav(div.id, filter, page);
            else if (filter === "domains")
                DS.displayItemsNav(div.id, filter, page);
            else if (filter === "projects")
                DS.displayItemsNav(div.id, filter, page);
        });
    }
};

Convert.convertFilterItemsMetricsEvol = function(filter) {
    var config_metric = filterItemsConfig();

    var divlabel = "FilterItemsMetricsEvol";
    divs = $("."+divlabel);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (filter === undefined) filter = $(this).data('filter');
            if (filter !== $(this).data('filter')) return;
            if (!filter) return;
            var metric = $(this).data('metric');
            var stacked = false;
            if ($(this).data('stacked')) stacked = true;
            if ($(this).data('min')) {
                config_viz.show_legend = false;
                config_viz.show_labels = true;
                config_viz.show_grid = true;
                // config_viz.show_mouse = false;
                config_viz.help = false;
            }
            // In unixtime
            var start = $(this).data('start');
            var end = $(this).data('end');
            config_metric.lines = {stacked : stacked};
            if ($('#'+$(this).data('legend-div')).length>0) {
                config_metric.legend = {
                container: $(this).data('legend-div')};
            } else config_metric.legend = {container: null};
            config_metric.show_legend = $(this).data('legend');

            var remove_last_point = $(this).data('remove-last-point');
            if (remove_last_point) config_metric.remove_last_point = true;

            div.id = metric+"-"+divlabel;
            $(this).empty();
            if (filter === "companies")
                DS.displayMetricCompanies(metric,div.id,
                    config_metric, start, end);
            else if (filter === "repos")
                DS.displayMetricRepos(metric,div.id,
                            config_metric, start, end);
            else if (filter === "domains")
                DS.displayMetricDomains(metric,div.id,
                            config_metric, start, end);
            else if (filter === "projects")
                DS.displayMetricProjects(metric,div.id,
                            config_metric, start, end);
        });
    }
};

Convert.convertFilterItemsMiniCharts = function(filter, page) {
    var config_metric = filterItemsConfig();

    var divlabel = "FilterItemsMiniCharts";
    divs = $("."+divlabel);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (filter === undefined) filter = $(this).data('filter');
            if (filter !== $(this).data('filter')) return;
            if (!filter) return;
            if ($(this).data('page')) page = $(this).data('page');
            var metrics = $(this).data('metrics');
            var order_by = $(this).data('order-by');
            var show_links = true;
            if ($(this).data('show_links') !== undefined)
                show_links = $(this).data('show_links');
            // In unixtime
            var start = $(this).data('start');
            var end = $(this).data('end');
            var convert = $(this).data('convert');

            var remove_last_point = $(this).data('remove-last-point');
            if (remove_last_point) config_metric.remove_last_point = true;

            div.id = metrics.replace(/,/g,"-")+"-"+filter+"-"+divlabel;
            $(this).empty();
            if (filter === "repos")
                DS.displayReposList(metrics.split(","),div.id,
                    config_metric, order_by, page, show_links, start, end, convert);
            else if (filter === "countries")
                DS.displayCountriesList(metrics.split(","),div.id,
                    config_metric, order_by, page, show_links, start, end, convert);
            else if (filter === "companies")
                DS.displayCompaniesList(metrics.split(","),div.id,
                    config_metric, order_by, page, show_links, start, end, convert);
            else if (filter === "domains")
                DS.displayDomainsList(metrics.split(","),div.id,
                    config_metric, order_by, page, show_links, start, end, convert);
            else if (filter === "projects")
                DS.displayProjectsList(metrics.split(","),div.id,
                    config_metric, order_by, page, show_links, start, end, convert);
        });
    }
};

Convert.convertFilterItemData = function (filter, item) {
    var divs = $(".FilterItemData");
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            var label = Report.cleanLabel(item);
            if (!div.id) div.id = "FilterItemData" + getRandomId();
            $("#"+div.id).append("<h1><small>"+label + "</small></h1>");
        });
    }
};


function composeProjectBreadcrumbs(project_id){
    //project id could be eclipe or eclipse.whatever
    var html = '<ul class="breadcrumb"> Project:&nbsp;&nbsp;';
    var aux = '';
    var tokens = [];
    var lentokens = 0;
    tokens = project_id.split('.');
    lentokens = tokens.length;
    /*html += '<li><a href="/">Summary</a> <span class="divider">/</span></li>';
    html += '<li><a href="projects.html">List of projects</a> <span class="divider">/</span></li>';*/
    $.each(tokens, function(key,value){
        if (key === 0){ //first
            aux += value;
        }else{
            aux += '.' + value;}

        if (key === lentokens - 1 ) { //if last
            html += '<li class="active">' + value + '</li>';
        }else{
            html += '<li><a href="project.html?project=' + aux +' ">' + value + '</a> <span class="divider">/</span></li>';
        }
    });
    html += '</ul>';
    return html;
}

Convert.convertProjectBreadcrumbs = function (filter, item) {
    //based on FilterItemData
    var divs = $(".ProjectBreadcrumbs");
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            $(this).empty();
            var label = Report.cleanLabel(item);
            if (!div.id) div.id = "ProjectBreadcrumbs" + getRandomId();
            $("#"+div.id).append(composeProjectBreadcrumbs(label));
        });
    }
};

Convert.convertFilterItemSummary = function(filter, item) {
    var divlabel = "FilterItemSummary";
    divs = $("."+divlabel);
    if (item !== null && divs.length > 0) {
        $.each(divs, function(id, div) {
            var real_item = item;
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (filter === undefined) filter = $(this).data('filter');
            if (filter !== $(this).data('filter')) return;
            if (!filter) return;
            if ($(this).data('item')) real_item = $(this).data('item');
            div.id = ds+"-"+filter+"-"+divlabel;
            $(this).empty();
            if (filter === "repos") {
                real_item = Convert.getRealItem(DS, filter, real_item);
                if (real_item) DS.displayRepoSummary(div.id, real_item, DS);
            }
            else if (filter === "countries")
                DS.displayCountrySummary(div.id, real_item, DS);
            else if (filter === "companies")
                DS.displayCompanySummary(div.id, real_item, DS);
            else if (filter === "domains")
                DS.displayDomainSummary(div.id, real_item, DS);
            else if (filter === "projects")
                DS.displayProjectSummary(div.id, real_item, DS);
        });
    }
};

Convert.convertFilterItemMetricsEvol = function(filter, item) {
    var config_metric = filterItemsConfig();
    var divlabel = "FilterItemMetricsEvol";
    divs = $("."+divlabel);
    if (item !== null && divs.length > 0) {
        $.each(divs, function(id, div) {
            var real_item = item;
            var metrics = $(this).data('metrics');
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (filter === undefined) filter = $(this).data('filter');
            if (filter !== $(this).data('filter')) return;
            if (!filter) return;
            if ($(this).data('item')) real_item = $(this).data('item');

            config_metric = loadHTMLEvolParameters(div, config_metric);

            div.id = Report.cleanLabel(item).replace(/ /g,"_")+"-";
            div.id += metrics.replace(/,/g,"-")+"-"+ds+"-"+filter+"-"+divlabel;
            $(this).empty();
            if (filter === "repos") {
                real_item = Convert.getRealItem(DS, filter, real_item);
                if (real_item) {
                    DS.displayMetricsRepo(real_item, metrics.split(","),
                            div.id, config_metric);
                }
                else $(this).hide();
            }
            else if (filter === "countries") {
                DS.displayMetricsCountry(real_item, metrics.split(","),
                    div.id, config_metric);
            }
            else if (filter === "companies") {
                DS.displayMetricsCompany(real_item, metrics.split(","),
                    div.id, config_metric);
            }
            else if (filter === "domains") {
                DS.displayMetricsDomain(real_item, metrics.split(","),
                    div.id, config_metric);
            }
            else if (filter === "projects") {
                DS.displayMetricsProject(real_item, metrics.split(","),
                    div.id, config_metric);
            }
        });
    }
};

Convert.convertFilterItemTop = function(filter, item) {
    var divlabel = "FilterItemTop";
    divs = $("."+divlabel);
    if (divs.length > 0) {
        $.each(divs, function(id, div) {
            var real_item = item;
            $(this).empty();
            ds = $(this).data('data-source');
            DS = Report.getDataSourceByName(ds);
            if (DS === null) return;
            if (filter === undefined) filter = $(this).data('filter');
            if (filter !== $(this).data('filter')) return;
            if (!filter) return;
            if ($(this).data('item')) real_item = $(this).data('item');
            var metric = $(this).data('metric');
            var period = $(this).data('period');
            var titles = $(this).data('titles');
            div.id = metric+"-"+ds+"-"+filter+"-"+divlabel+"-"+getRandomId();
            $(this).empty();
            div.className = "";
            // Only for Company yet
            if (filter === "companies")
                DS.displayTopCompany(real_item,div.id,metric,period,titles);
        });
    }
};

Convert.convertFilterStudyItem = function (filter, item) {
    // Control convert is not called several times per filter
    var convertfn = Convert.convertFilterStudyItem;
    if (convertfn.done === undefined) {convertfn.done = {};}
    else if (convertfn.done[filter] === true) return;

    // repositories comes from Automator config
    if (filter === "repositories") filter = "repos";

    if (item === undefined) {
        if (filter === "repos") item = Report.getParameterByName("repository");
        if (filter === "countries") item = Report.getParameterByName("country");
        if (filter === "companies") item = Report.getParameterByName("company");
        if (filter === "domains") item = Report.getParameterByName("domain");
        if (filter === "projects") item = Report.getParameterByName("project");
    }

    if (!item) return;

    if (Loader.FilterItemCheck(item, filter) === false) return;

    Convert.convertFilterItemData(filter, item);
    Convert.convertProjectBreadcrumbs(filter, item);
    Convert.convertFilterItemSummary(filter, item);
    Convert.convertFilterItemMetricsEvol(filter, item);
    Convert.convertFilterItemTop(filter, item);
    Convert.convertProjectData();

    Convert.activateHelp();

    convertfn.done[filter] = true;
};

Convert.activateHelp = function() {
    // Popover help system
    $('.help').popover({
        html: true,
        trigger: 'manual'
    }).click(function(e) {
        $(this).popover('toggle');
        e.stopPropagation();
    });
};

Convert.convertFilterStudy = function(filter) {
    var page = Report.getCurrentPage();
    if (page === null) {
        page = Report.getParameterByName("page");
        if (page !== undefined) Report.setCurrentPage(page);
    }

    if (page === undefined) {
        // If there are items widgets config default page
        if ($("[class^='FilterItems']").length > 0) {
            page = 1;
            Report.setCurrentPage(page);
        }
        else return;
    }

    // repositories comes from Automator config
    if (filter === "repositories") filter = "repos";

    // If data is not available load them and cb this function
    if (Loader.check_filter_page (page, filter) === false) {
        $.each(Report.getDataSources(), function(index, DS) {
            Loader.data_load_items_page (DS, page, Convert.convertFilterStudy, filter);
        });
        return;
    }

    Convert.convertFilterItemsSummary(filter);
    Convert.convertFilterItemsGlobal(filter);
    Convert.convertFilterItemsNav(filter, page);
    Convert.convertFilterItemsMetricsEvol(filter);
    Convert.convertFilterItemsMiniCharts(filter, page);
};

Convert.convertDSTable = function() {
    // Converts the div DataSourceTable into a table
    var dst = "DataSourcesTable";
    var divs = $("." + dst);
    var DS, ds;
    if (divs.length > 0) {
        var unique = 0;
        $.each(divs, function(id, div) {
            $(this).empty();
            div.id = dst + (unique++);
            Viz.displayDataSourcesTable(div);
        });
    }
};

Convert.convertBasicDivs = function() {
    Convert.convertNavbar();
    Convert.convertFooter(); 
    //Convert.convertRefcard(); //deprecated
    Convert.convertDSTable();
    Convert.convertGlobalData();
    //Convert.convertProjectData();
    Convert.convertSummary();
};

Convert.convertBasicDivsMisc = function() {
    Convert.convertRadarActivity();
    Convert.convertRadarCommunity();
    Convert.convertTreemap();
    Convert.convertBubbles();
};

Convert.convertBasicMetrics = function(config) {
    Convert.convertMetricsEvol();
    Convert.convertTimeTo();
    Convert.convertMarkovTable();
};

})();
