// BEGIN url-rewrite (CloudFront Functions, cloudfront-js-2.0, viewer-request)
// Maps clean URLs onto the prerendered files in S3 and enforces one canonical
// form per page. Kept in sync with aws/cloudformation.yml by a unit test.
// CANONICAL_HOST is filled in by CloudFormation (!Sub) from the CanonicalHost
// parameter; empty means "no host redirect".
//   other custom host           -> 301 https://CANONICAL_HOST/x  (*.cloudfront.net is left alone for testing)
//   /about/                     -> 301 /about
//   /about.html, /index.html    -> 301 /about, /
//   /                           -> serves /index.html
//   /about                      -> serves /about.html
//   /assets/app.js              -> unchanged (has a file extension)
var CANONICAL_HOST = '${CanonicalHost}';

function handler(event) {
  var request = event.request;
  var uri = request.uri;
  var host = request.headers.host ? request.headers.host.value : '';
  var qs = queryString(request.querystring);

  if (CANONICAL_HOST && host && host !== CANONICAL_HOST && !/\.cloudfront\.net$/.test(host)) {
    return redirect('https://' + CANONICAL_HOST + uri + qs);
  }
  if (uri.length > 1 && uri.charAt(uri.length - 1) === '/') {
    return redirect(uri.replace(/\/+$/, '') + qs);
  }
  if (uri === '/index.html') {
    return redirect('/' + qs);
  }
  if (uri.length > 5 && uri.substring(uri.length - 5) === '.html' && uri !== '/404.html') {
    return redirect(uri.substring(0, uri.length - 5) + qs);
  }
  if (uri === '/') {
    request.uri = '/index.html';
  } else if (uri.lastIndexOf('.') < uri.lastIndexOf('/')) {
    request.uri = uri + '.html';
  }
  return request;
}

function queryString(q) {
  var parts = [];
  for (var key in q) {
    var entry = q[key];
    var values = entry.multiValue ? entry.multiValue : [entry];
    for (var i = 0; i < values.length; i++) {
      parts.push(values[i].value === '' ? key : key + '=' + values[i].value);
    }
  }
  return parts.length ? '?' + parts.join('&') : '';
}

function redirect(location) {
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: { location: { value: location }, 'cache-control': { value: 'max-age=3600' } },
  };
}
// END url-rewrite
