{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
  };

  outputs = {
    systems,
    nixpkgs,
    devenv,
    ...
  } @ inputs: let
    forEachSystem = nixpkgs.lib.genAttrs (import systems);
  in {
    devShells = forEachSystem (system: let
      # Define the packages for the given system
      pkgs = import nixpkgs {
        inherit system;
        config.allowUnfree = true;
      };
    in {
      default = devenv.lib.mkShell {
        inherit inputs pkgs;
        modules = [
          { # https://devenv.sh/reference/options/
            packages = [
              pkgs.nodejs
              # You can set the major version of Node.js to a specific one instead of the default version
              # pkgs.nodejs-19_x

              # You can choose pnpm, yarn, bun, or none (npm).
              # pkgs.nodePackages.pnpm
              # pkgs.yarn
              pkgs.bun

              pkgs.typescript
              pkgs.nodePackages.typescript-language-server
            ];

            # Python environment
            languages.python = {
              enable = true;
              venv = {
                enable = true;
                requirements = ./requirements.txt;
              };
            };
          }
        ];
      };
    });
  };
}
