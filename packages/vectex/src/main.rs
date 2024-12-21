fn main() {
    // Get filename from command-line argument
    let args: Vec<String> = std::env::args().collect();
    if args.len() != 2 && args.len() != 3 {
        println!("Usage: vectex <filename>");
        return;
    }
    let filename = args[1].clone();

    // Get possible command-line argument 2
    let color = if args.len() == 3 {
        args[2].clone()
    } else {
        String::from("#000000")
    };

    // Get LaTeX input as stdin
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();

    // Write input to a new file
    std::fs::write(format!("{filename}.tex"), wrap_latex(&input)).unwrap();

    // Run latex command to compile
    std::process::Command::new("latex")
        .arg(format!("{filename}.tex"))
        .output()
        .unwrap();

    // Run dvisvgm to convert to SVG
    std::process::Command::new("dvisvgm")
        .arg("--no-fonts")
        .arg("--scale=20")
        .arg("--exact")
        .arg(format!("{filename}.dvi"))
        .arg("-o")
        .arg(&filename)
        .output()
        .unwrap();

    // Remove files that would have been generated
    std::fs::remove_file(format!("{filename}.tex")).unwrap();
    std::fs::remove_file(format!("{filename}.aux")).unwrap();
    std::fs::remove_file(format!("{filename}.dvi")).unwrap();
    std::fs::remove_file(format!("{filename}.log")).unwrap();

    // Read new SVG file
    let svg = std::fs::read_to_string(&filename).unwrap();

    // Wrtie processed SVG file
    std::fs::write(filename, process_svg(&svg, &color)).unwrap();
}

// Function that takes a LaTeX string and outputs a wrapped LaTeX string
fn wrap_latex(input: &str) -> String {
    format!(
        r"\documentclass[12pt]{{article}}
        \thispagestyle{{empty}}
        \begin{{document}}
        $$ {} $$
        \end{{document}}",
        input
    )
}

fn process_svg(input: &str, color: &str) -> String {
    input
        .replace(
            "<path",
            &format!("<path stroke=\"{color}\" fill=\"{color}\" stroke-width=\"0\""),
        )
        .replace("<rect", &format!("<rect fill=\"{color}\""))
}
