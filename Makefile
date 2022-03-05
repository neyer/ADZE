proto_lib:
	protoc --proto_path=proto --js_out=import_style=commonjs,binary:plugin/adze/src proto/adze.proto

