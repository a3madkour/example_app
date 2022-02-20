#include "Grammar.h"
#include "VisGraph.h"
#include <emscripten/bind.h>

using namespace emscripten;

float lerp(float a, float b, float t) { return (1 - t) * a + t * b; }
VisGraph generate(std::string json_file) {
  Grammar gr(json_file);
  Grammar::GeneratedGraph gg = gr.generateGraph();
  Graph graph = gg.first;
  VisGraph g = graph.toVisGraph();
  return g;
}

std::vector<VisGraph> generate_n(std::string json_file, int n) {
  Grammar gr(json_file);
  std::vector<VisGraph> gs;
  for (int i = 0; i < n; i++) {
    Grammar::GeneratedGraph gg = gr.generateGraph();
    Graph graph = gg.first;
    VisGraph g = graph.toVisGraph();
    gs.push_back(g);
  }
  return gs;
}
EMSCRIPTEN_BINDINGS(Module) {
  function("lerp", &lerp);
  function("generate", &generate);
  function("generate_n", &generate_n);
  class_<VisNode>("VisNode")
      .constructor()
      .property("id", &VisNode::id)
      .property("index", &VisNode::index)
      .property("abbrev", &VisNode::abbrev)
      .property("label", &VisNode::label)
      .property("mark", &VisNode::mark)
      .class_function("getStringFromInstance", &VisNode::getStringFromInstance);
  class_<VisEdge>("VisEdge")
      .constructor()
      .property("from", &VisEdge::from)
      .property("to", &VisEdge::to)
      .class_function("getStringFromInstance", &VisEdge::getStringFromInstance);
  register_vector<VisNode>("nodes");
  register_vector<VisEdge>("edges");
  class_<VisGraph>("VisGraph")
      .constructor()
      .property("id", &VisGraph::id)
      .property("nodes", &VisGraph::nodes)
      .property("edges", &VisGraph::edges)
      .property("leniency", &VisGraph::leniency)
      .property("mission_linearity", &VisGraph::mission_linearity)
      .property("map_linearity", &VisGraph::map_linearity)
      .property("path_redundancy", &VisGraph::path_redundancy)
      .class_function("getStringFromInstance",
                      &VisGraph::getStringFromInstance);
  register_vector<VisGraph>("graphs");
}
