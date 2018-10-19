# minimum version
require "pyrite/versions/v1.10"

module Kubectlmenu
  VERSION = "0.1.0"

  string = `/usr/local/bin/kubectl get pods --all-namespaces -o=json`
  namespaces = {} of String => Array(Pyrite::Api::Core::V1::Pod)
  Pyrite::Api::Core::V1::List.from_json(string).items.not_nil!.select do |pod|
    if pod.is_a?(Pyrite::Api::Core::V1::Pod)
      namespace_name = pod.metadata.try(&.namespace).to_s
      unless namespaces.has_key?(namespace_name)
        namespaces[namespace_name] = Array(Pyrite::Api::Core::V1::Pod).new 
      end
      namespaces[namespace_name] << pod
    end
  end
  namespaces.each do |name,pods|
    puts name
    pods.each do |p|
      puts "-- #{p.metadata.try(&.name)}"
    end
  end
end
