<?php

// Quick and dirty SGF parser.

class SGF {
	var $sgf, $index, $root;
	function SGF($sgf) {
		$this->sgf = $sgf;
		$this->index = 0;
		$this->tree = $this->parseTree(null);
	}
	function parseTree($parent) {
		$tree = array();
		$tree['nodes'] = array();
		$tree['trees'] = array();
		while ($this->index < strlen($this->sgf)) {
			$char = $this->sgf[$this->index];
			$this->index++;
			switch ($char) {
				case ';':
					$node = $this->parseNode();
					//if (is_null($tree['nodes'])) $tree['nodes'] = array();
					array_push($tree['nodes'], $node);
					break;
				case '(':
					//if (is_null($tree['trees'])) $tree['trees'] = array();
					array_push($tree['trees'], $this->parseTree($tree));
					break;
				case ')':
					return $tree;
					break;
			}
		}
		return $tree;
	}
	function parseNode() {
		$node = array();
		$key = "";
		$values = array();
		$i = 0;
		while ($this->index < strlen($this->sgf)) {
			$char = $this->sgf[$this->index];
			if ($char == ';' || $char == '(' || $char == ')')
				break;
			if ($char == '[') {
				while ($this->sgf[$this->index] == '[') {
					$this->index++;
					while ($this->sgf[$this->index] != ']' && $this->index < strlen($this->sgf)) {
						if ($this->sgf[$this->index] == '\\')
							$this->index++;
						$values[$i] .= $this->sgf[$this->index];
						$this->index++;
					}
					$i++;
					while ($this->sgf[$this->index] == ']' || $this->sgf[$this->index] == '\r' || $this->sgf[$this->index] == 'n')
						$this->index++;
				}
				$node[$key] = count($values) > 1 ? $values : $values[0];
				$key = "";
				$values = array();
				$i = 0;
				continue;
			}
			if ($char != " " && $char != "\n" && $char != "\r" && $char != "\t")
				$key .= $char;
			$this->index++;
		}
		return $node;
	}
}

?>