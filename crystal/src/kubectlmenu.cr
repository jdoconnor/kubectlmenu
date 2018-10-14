# minimum version
require "pyrite/versions/v1.10"

module Kubectlmenu
  VERSION = "0.1.0"

  string = `kubectl get pods --all-namespaces -o=json`
  puts "done with kubectl"
  # namespaces = Kubernetes::Api::V1::NamespaceList
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
  puts namespaces.size
  puts "==="
  namespaces.each do |k,v|
    puts k
    puts "--"
    v.each do |p|
      puts p.metadata.try(&.name)
    end
  end
end
