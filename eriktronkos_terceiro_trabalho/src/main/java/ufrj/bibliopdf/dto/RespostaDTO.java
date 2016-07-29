package ufrj.bibliopdf.dto;

import java.io.Serializable;
import javax.json.Json;
import javax.json.JsonObject;

public class RespostaDTO implements Serializable{
    
    private String patrimonio = "";
    private String titulo = "";
    private String autoria = "";
    private String veiculo = "";
    private String data_publicacao = "";
    private String palchave = "";
    private String nrohits = "";

    public String getNrohits() {
        return nrohits;
    }

    public void setNrohits(String nrohits) {
        this.nrohits = nrohits;
    }

    public String getPatrimonio() {
        return patrimonio;
    }

    public void setPatrimonio(String patrimonio) {
        this.patrimonio = patrimonio!=null?patrimonio:"";
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo!=null?titulo:"";
    }

    public String getAutoria() {
        return autoria;
    }

    public void setAutoria(String autoria) {
        this.autoria = autoria!=null?autoria:"";
    }

    public String getVeiculo() {
        return veiculo;
    }

    public void setVeiculo(String veiculo) {
        this.veiculo = veiculo!=null?veiculo:"";
    }

    public String getData_publicacao() {
        return data_publicacao;
    }

    public void setData_publicacao(String data_publicacao) {
        this.data_publicacao = data_publicacao;
    }

    public String getPalchave() {
        return palchave;
    }

    public void setPalchave(String palchave) {
        this.palchave = palchave!=null?palchave:"";
    }
    
    public JsonObject toJson(){
        return Json.createObjectBuilder()
                    .add("patrimonio",this.patrimonio)
                    .add("titulo",this.titulo)
                    .add("autoria",this.autoria)
                    .add("veiculo",this.veiculo)
                    .add("data_publicacao",this.data_publicacao)
                    .add("palchave",this.palchave)
                    .add("nrohits",this.nrohits)
                    .build();
    }
    
    @Override
    public String toString(){
        return toJson().toString();
    }
}
