function handler(event) {
	var request = event.request;
    if (request.uri.endsWith('/sub')) {
        request.uri = request.uri.replace(/\/[^ ]*/, "/");
        request.uri += 'main/index.html';
    }
    else if (request.uri.endsWith('/sub/')) {
        request.uri = request.uri.replace(/\/[^ ]*/, "/");
        request.uri += 'main/index.html';
    }
	else if (request.uri.endsWith('/')) {
        request.uri += 'static/index.html';
    }
	return request;
}
