export class DefinePattern {
    public static readonly EMAIL = /^[A-z0-9_\.\+\-]+@[A-z0-9\-]+\.[A-z0-9\-\.]+$/;
    // tslint:disable-next-line: max-line-length
    public static readonly URL = /^(?:(?:http|https|ftp):\/\/)(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    public static readonly PHONE = /^(\+?84|0|84)([0-9]{1})([0-9]{1})([0-9]{1})([0-9]{1})([0-9]{1})([0-9]{1})([0-9]{1})([0-9]{1})([0-9]{1})([0-9]{1})?$/;
    public static readonly NUMBER = /\d+/g;
    public static readonly ENCODE_URI = /%([0-9A-F]{2})/g;
    public static readonly NAME = /^\w+[A-Za-z\s\d]+$/;
    public static readonly NAME_SPECIAL = /[~!@#$%^&*()-+=<>,?\/\\:;"']/;
    public static readonly NAME_PROFILE = /([\w\W\d\s]+)+/;
    public static readonly EMOJI = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    public static readonly TEXT_NUMBER = /^[ àáảãạăắằẵặẳâầấậẫẩđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹÀÁẢÃẠĂẮẰẴẶẲÂẦẤẬẪẨĐÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸA-Za-z0-9]+$/;
    public static readonly PEM = () => /^(0|1):([0-9]{1,2}):(\{\{path-api\}\}):([a-zA-Z0-9\/-]+)$/g;
    public static readonly TAX = /^[0-9]{10,13}$/;
}
