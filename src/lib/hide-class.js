import $ from 'jquery';

export default (() => {
  let cssRules = '{display: none !important;}';
  let hideClassName = `hidden-by-aptivator-${(Math.random() + '').slice(2)}`;
  let $style = $('<style/>').attr('type', 'text/css').html(`.${hideClassName} ${cssRules}`);
  $('head').append($style);
  return hideClassName;
})();
